-- =============================================
-- My Family Module — Database Schema Creation
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- =============================================
-- Schema: family_graph
-- =============================================
CREATE SCHEMA IF NOT EXISTS family_graph;

CREATE TABLE family_graph.person (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id   VARCHAR(20) NOT NULL,
    linked_user_id  VARCHAR(20),

    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100),
    middle_name     VARCHAR(100),
    maiden_name     VARCHAR(100),
    gender          VARCHAR(10) CHECK (gender IN ('male', 'female')),

    birth_date      DATE,
    birth_date_precision VARCHAR(10) DEFAULT 'unknown'
                    CHECK (birth_date_precision IN ('full', 'year_only', 'unknown')),
    is_alive        BOOLEAN NOT NULL DEFAULT TRUE,
    death_date      DATE,
    death_date_precision VARCHAR(10) DEFAULT 'unknown'
                    CHECK (death_date_precision IN ('full', 'year_only', 'unknown')),

    phone           VARCHAR(20),
    address_text    TEXT,
    address_lat     DECIMAL(10, 8),
    address_lng     DECIMAL(11, 8),

    photo_url       TEXT,
    social_links    JSONB DEFAULT '{}',
    notes           TEXT,

    is_confirmed    BOOLEAN NOT NULL DEFAULT FALSE,
    confirmed_at    TIMESTAMPTZ,
    is_archived     BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at     TIMESTAMPTZ,

    tree_path       ltree,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_death_after_birth
        CHECK (death_date IS NULL OR birth_date IS NULL OR death_date >= birth_date)
);

CREATE INDEX idx_person_owner ON family_graph.person(owner_user_id);
CREATE INDEX idx_person_linked ON family_graph.person(linked_user_id) WHERE linked_user_id IS NOT NULL;
CREATE INDEX idx_person_tree_path ON family_graph.person USING GIST(tree_path);
CREATE INDEX idx_person_confirmed ON family_graph.person(owner_user_id, is_confirmed);
CREATE INDEX idx_person_birth_date ON family_graph.person(birth_date) WHERE birth_date IS NOT NULL;
CREATE INDEX idx_person_phone ON family_graph.person(phone) WHERE phone IS NOT NULL;

CREATE TABLE family_graph.couple_relationship (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id   VARCHAR(20) NOT NULL,
    person_a_id     UUID NOT NULL REFERENCES family_graph.person(id) ON DELETE CASCADE,
    person_b_id     UUID NOT NULL REFERENCES family_graph.person(id) ON DELETE CASCADE,

    relationship_type VARCHAR(20) NOT NULL
        CHECK (relationship_type IN ('couple', 'civil_union', 'married', 'divorced', 'widowed')),

    start_date      DATE,
    start_date_precision VARCHAR(10) DEFAULT 'unknown'
                    CHECK (start_date_precision IN ('full', 'year_only', 'unknown')),
    end_date        DATE,
    end_date_precision VARCHAR(10) DEFAULT 'unknown'
                    CHECK (end_date_precision IN ('full', 'year_only', 'unknown')),
    marriage_place  TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_different_persons CHECK (person_a_id <> person_b_id),
    CONSTRAINT chk_end_after_start
        CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX idx_couple_owner ON family_graph.couple_relationship(owner_user_id);
CREATE INDEX idx_couple_person_a ON family_graph.couple_relationship(person_a_id);
CREATE INDEX idx_couple_person_b ON family_graph.couple_relationship(person_b_id);

CREATE TABLE family_graph.parent_child (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id   VARCHAR(20) NOT NULL,
    parent_id       UUID NOT NULL REFERENCES family_graph.person(id) ON DELETE CASCADE,
    child_id        UUID NOT NULL REFERENCES family_graph.person(id) ON DELETE CASCADE,

    relationship_type VARCHAR(20) NOT NULL
        CHECK (relationship_type IN ('biological', 'adoption', 'guardianship', 'foster')),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_parent_not_child CHECK (parent_id <> child_id)
);

CREATE INDEX idx_pc_owner ON family_graph.parent_child(owner_user_id);
CREATE INDEX idx_pc_parent ON family_graph.parent_child(parent_id);
CREATE INDEX idx_pc_child ON family_graph.parent_child(child_id);
CREATE UNIQUE INDEX idx_pc_unique
    ON family_graph.parent_child(owner_user_id, parent_id, child_id, relationship_type);

CREATE TABLE family_graph.change_request (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_person_id    UUID NOT NULL REFERENCES family_graph.person(id) ON DELETE CASCADE,
    requester_user_id   VARCHAR(20) NOT NULL,
    tree_owner_user_id  VARCHAR(20) NOT NULL,

    proposed_changes    JSONB NOT NULL,

    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),

    expires_at          TIMESTAMPTZ NOT NULL,
    reviewed_at         TIMESTAMPTZ,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cr_tree_owner ON family_graph.change_request(tree_owner_user_id, status);
CREATE INDEX idx_cr_requester ON family_graph.change_request(requester_user_id);
CREATE INDEX idx_cr_expires ON family_graph.change_request(expires_at) WHERE status = 'pending';

CREATE TABLE family_graph.audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         VARCHAR(20) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID NOT NULL,
    action          VARCHAR(20) NOT NULL,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON family_graph.audit_log(user_id);
CREATE INDEX idx_audit_entity ON family_graph.audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON family_graph.audit_log(created_at);

CREATE TABLE family_graph.outbox (
    id              BIGSERIAL PRIMARY KEY,
    event_type      VARCHAR(100) NOT NULL,
    payload         JSONB NOT NULL,
    published       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_outbox_unpublished
    ON family_graph.outbox(created_at) WHERE published = FALSE;

-- =============================================
-- Schema: privacy
-- =============================================
CREATE SCHEMA IF NOT EXISTS privacy;

CREATE TABLE privacy.privacy_settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id       UUID NOT NULL,
    owner_user_id   VARCHAR(20) NOT NULL,

    share_photo     BOOLEAN NOT NULL DEFAULT FALSE,
    share_phone     BOOLEAN NOT NULL DEFAULT FALSE,
    share_address   BOOLEAN NOT NULL DEFAULT FALSE,
    share_social    BOOLEAN NOT NULL DEFAULT FALSE,
    share_notes     BOOLEAN NOT NULL DEFAULT FALSE,
    share_birth_date BOOLEAN NOT NULL DEFAULT FALSE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_privacy_person UNIQUE (person_id, owner_user_id)
);

CREATE INDEX idx_privacy_owner ON privacy.privacy_settings(owner_user_id);
CREATE INDEX idx_privacy_person ON privacy.privacy_settings(person_id);

-- =============================================
-- Schema: gamification
-- =============================================
CREATE SCHEMA IF NOT EXISTS gamification;

CREATE TABLE gamification.user_score (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         VARCHAR(20) NOT NULL UNIQUE,

    total_points    INTEGER NOT NULL DEFAULT 0 CHECK (total_points >= 0),
    current_level   INTEGER NOT NULL DEFAULT 1,

    relatives_added     INTEGER NOT NULL DEFAULT 0,
    relatives_confirmed INTEGER NOT NULL DEFAULT 0,

    max_relatives   INTEGER NOT NULL DEFAULT 100,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    premium_purchased_at TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_score_user ON gamification.user_score(user_id);
CREATE INDEX idx_score_level ON gamification.user_score(current_level);

CREATE TABLE gamification.level_definition (
    level           INTEGER PRIMARY KEY,
    min_points      INTEGER NOT NULL,
    name_uz         VARCHAR(100) NOT NULL,
    name_ru         VARCHAR(100) NOT NULL,
    icon_url        TEXT,
    benefits_json   JSONB DEFAULT '{}'
);

CREATE TABLE gamification.points_history (
    id              BIGSERIAL PRIMARY KEY,
    user_id         VARCHAR(20) NOT NULL,
    points_delta    INTEGER NOT NULL,
    reason          VARCHAR(50) NOT NULL,
    reference_id    UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_user ON gamification.points_history(user_id);
CREATE INDEX idx_points_created ON gamification.points_history(created_at);

-- =============================================
-- Schema: transfer
-- =============================================
CREATE SCHEMA IF NOT EXISTS transfer;

CREATE TABLE transfer.free_transfer_selection (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         VARCHAR(20) NOT NULL,
    selected_person_id UUID NOT NULL,
    selected_user_id VARCHAR(20) NOT NULL,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    selected_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changeable_after TIMESTAMPTZ NOT NULL,

    deactivated_at  TIMESTAMPTZ,
    deactivation_reason VARCHAR(50),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_transfer_active
    ON transfer.free_transfer_selection(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_transfer_user ON transfer.free_transfer_selection(user_id);

CREATE TABLE transfer.transfer_log (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_user_id  VARCHAR(20) NOT NULL,
    receiver_user_id VARCHAR(20) NOT NULL,
    amount          BIGINT NOT NULL,
    currency        VARCHAR(3) NOT NULL DEFAULT 'UZS',

    click_transaction_id VARCHAR(100),

    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'reversed')),

    error_message   TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_tlog_sender ON transfer.transfer_log(sender_user_id, created_at);
CREATE INDEX idx_tlog_receiver ON transfer.transfer_log(receiver_user_id, created_at);

-- =============================================
-- Schema: notification
-- =============================================
CREATE SCHEMA IF NOT EXISTS notification;

CREATE TABLE notification.scheduled_notification (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         VARCHAR(20) NOT NULL,

    source_type     VARCHAR(30) NOT NULL,
    source_id       UUID,

    scheduled_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fire_at         TIMESTAMPTZ NOT NULL,

    title_uz        TEXT NOT NULL,
    title_ru        TEXT NOT NULL,
    body_uz         TEXT NOT NULL,
    body_ru         TEXT NOT NULL,

    channels        TEXT[] NOT NULL DEFAULT ARRAY['push', 'in_app'],

    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),

    sent_at         TIMESTAMPTZ,
    error_message   TEXT,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_fire ON notification.scheduled_notification(fire_at)
    WHERE status = 'pending';
CREATE INDEX idx_notif_user ON notification.scheduled_notification(user_id);
CREATE INDEX idx_notif_source ON notification.scheduled_notification(source_type, source_id);

CREATE TABLE notification.in_app_notification (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         VARCHAR(20) NOT NULL,

    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    action_type     VARCHAR(30),
    action_payload  JSONB,

    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inapp_user_unread ON notification.in_app_notification(user_id)
    WHERE is_read = FALSE;
CREATE INDEX idx_inapp_user ON notification.in_app_notification(user_id, created_at DESC);

-- =============================================
-- Schema: cards
-- =============================================
CREATE SCHEMA IF NOT EXISTS cards;

CREATE TABLE cards.card_template (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title_uz        VARCHAR(200) NOT NULL,
    title_ru        VARCHAR(200) NOT NULL,
    image_url       TEXT NOT NULL,
    animation_url   TEXT,

    price_type      VARCHAR(20) NOT NULL
        CHECK (price_type IN ('free', 'paid', 'premium_free')),
    price_amount    BIGINT DEFAULT 0,

    category        VARCHAR(50),
    holiday_id      UUID,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    display_order   INTEGER NOT NULL DEFAULT 0,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_template_active ON cards.card_template(is_active, display_order);
CREATE INDEX idx_template_category ON cards.card_template(category) WHERE is_active = TRUE;

CREATE TABLE cards.sent_card (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id     UUID NOT NULL REFERENCES cards.card_template(id),

    sender_user_id  VARCHAR(20) NOT NULL,
    receiver_user_id VARCHAR(20) NOT NULL,

    personal_message TEXT,

    payment_status  VARCHAR(20) DEFAULT 'free'
        CHECK (payment_status IN ('free', 'paid', 'pending_payment', 'payment_failed')),
    click_payment_id VARCHAR(100),

    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,

    deleted_by_sender   BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by_receiver BOOLEAN NOT NULL DEFAULT FALSE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sent_receiver_unread ON cards.sent_card(receiver_user_id)
    WHERE is_read = FALSE AND deleted_by_receiver = FALSE;
CREATE INDEX idx_sent_sender ON cards.sent_card(sender_user_id, created_at DESC)
    WHERE deleted_by_sender = FALSE;
CREATE INDEX idx_sent_receiver ON cards.sent_card(receiver_user_id, created_at DESC)
    WHERE deleted_by_receiver = FALSE;

-- =============================================
-- Schema: admin
-- =============================================
CREATE SCHEMA IF NOT EXISTS admin;

CREATE TABLE admin.holiday (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    title_uz        VARCHAR(200) NOT NULL,
    title_ru        VARCHAR(200) NOT NULL,
    description_uz  TEXT,
    description_ru  TEXT,

    holiday_date    DATE NOT NULL,
    is_recurring    BOOLEAN NOT NULL DEFAULT TRUE,

    icon_url        TEXT,
    banner_url      TEXT,

    target_audience VARCHAR(30) NOT NULL DEFAULT 'all'
        CHECK (target_audience IN ('all', 'male', 'female', 'premium', 'custom')),
    target_criteria JSONB,

    notify_days_before INTEGER[] DEFAULT ARRAY[7, 1, 0],
    notification_title_uz TEXT,
    notification_title_ru TEXT,
    notification_body_uz  TEXT,
    notification_body_ru  TEXT,

    cta_action      VARCHAR(30),
    cta_payload     JSONB,

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_holiday_date ON admin.holiday(holiday_date) WHERE is_active = TRUE;
CREATE INDEX idx_holiday_recurring ON admin.holiday(is_recurring) WHERE is_active = TRUE;

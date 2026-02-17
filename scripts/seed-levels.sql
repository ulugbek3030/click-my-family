INSERT INTO gamification.level_definition (level, min_points, name_uz, name_ru, icon_url, benefits_json) VALUES
(1, 0,   'Yangi oila',     'Новая семья',     NULL, '{}'),
(2, 5,   'Kichik oila',    'Малая семья',     NULL, '{"free_transfer": false}'),
(3, 15,  'Oila',           'Семья',           NULL, '{"free_transfer": true}'),
(4, 30,  'Katta oila',     'Большая семья',   NULL, '{"free_transfer": true}'),
(5, 50,  'Keng oila',      'Широкая семья',   NULL, '{"free_transfer": true}'),
(6, 80,  'Sulola',         'Род',             NULL, '{"free_transfer": true}'),
(7, 120, 'Katta sulola',   'Большой род',     NULL, '{"free_transfer": true}'),
(8, 170, 'Avlod',          'Поколение',       NULL, '{"free_transfer": true}'),
(9, 230, 'Shajarа',        'Древо',           NULL, '{"free_transfer": true}'),
(10, 300, 'Buyuk shajara', 'Великое древо',   NULL, '{"free_transfer": true}')
ON CONFLICT (level) DO NOTHING;

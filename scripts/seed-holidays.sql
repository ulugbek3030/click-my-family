INSERT INTO admin.holiday (title_uz, title_ru, holiday_date, is_recurring, target_audience, notify_days_before) VALUES
('Yangi yil',                'Новый год',                       '2026-01-01', TRUE, 'all', ARRAY[7, 1, 0]),
('Vatanni himoya qilish kuni','День защитника Отечества',       '2026-01-14', TRUE, 'male', ARRAY[7, 1, 0]),
('Xalqaro xotin-qizlar kuni','Международный женский день',     '2026-03-08', TRUE, 'female', ARRAY[7, 1, 0]),
('Navro''z bayrami',         'Навруз',                          '2026-03-21', TRUE, 'all', ARRAY[7, 1, 0]),
('Xotira va qadrlash kuni',  'День памяти и почестей',          '2026-05-09', TRUE, 'all', ARRAY[1, 0]),
('Mustaqillik kuni',         'День независимости',              '2026-09-01', TRUE, 'all', ARRAY[7, 1, 0]),
('O''qituvchilar kuni',      'День учителей',                   '2026-10-01', TRUE, 'all', ARRAY[1, 0]),
('Konstitutsiya kuni',       'День Конституции',                '2026-12-08', TRUE, 'all', ARRAY[1, 0])
ON CONFLICT DO NOTHING;

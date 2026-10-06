INSERT INTO clients (name, email, phone, notes) VALUES
('FoxSD', 'foxsd520@gmail.com', '+966000000000', 'مالك المشروع الأساسي ومالك العلامة التجاري�� FoxSD.');

INSERT INTO projects (client_id, title, type, budget, notes) VALUES
(1, 'منصة Fox AI Business', 'system', 5000, 'منصة لإدارة العملاء، المهام، المشاريع، والتحكم الذكي في الأعمال.');

INSERT INTO tasks (project_id, title, status, notes) VALUES
(1, 'تهيئة قاعدة البيانات', 'done', 'إعداد SQLite ومخطط الجداول الأساسية.'),
(1, 'تصميم واجهة الداشبورد', 'pending', 'واجهة رئيسية لعرض العملاء والمشاريع والمهام.');

INSERT INTO conversations (speaker, message, intent, metadata) VALUES
('user', 'أريد نظامًا لإدارة الأعمال الخاصة بي في FoxSD', 'project', '{"source":"seed"}'),
('assistant', 'تم تسجيل طلبك بنجاح، وسأبني لك نظامًا متكاملًا لإدارة الأعمال.', 'project', '{"source":"seed"}');

-- Sample programs data for laptop-selector
-- Insert this data into your Supabase programs table

INSERT INTO programs (name, version, category, cpu_min, cpu_rec, gpu_min, gpu_rec, ram_min_gb, ram_rec_gb) VALUES
-- Gaming Programs
('Adobe Photoshop', '2024', 'Gaming', 2, 4, 2, 4, 8, 16),
('Adobe Premiere Pro', '2024', 'Gaming', 2, 6, 2, 6, 8, 32),
('Blender', '4.0', 'Gaming', 2, 8, 2, 8, 8, 32),
('Unity', '2022.3', 'Gaming', 2, 4, 2, 6, 8, 16),
('Unreal Engine', '5.3', 'Gaming', 4, 8, 4, 8, 16, 32),
('Maya', '2025', 'Gaming', 2, 6, 2, 6, 8, 32),
('3ds Max', '2025', 'Gaming', 2, 6, 2, 6, 8, 32),
('Cinema 4D', '2024', 'Gaming', 2, 6, 2, 6, 8, 32),

-- Office Programs
('Microsoft Office', '2021', 'Office', 1, 2, 1, 1, 4, 8),
('Google Workspace', 'Latest', 'Office', 1, 2, 1, 1, 4, 8),
('Adobe Acrobat', 'DC', 'Office', 1, 2, 1, 1, 4, 8),
('Slack', 'Latest', 'Office', 1, 2, 1, 1, 4, 8),
('Zoom', 'Latest', 'Office', 1, 2, 1, 1, 4, 8),
('Teams', 'Latest', 'Office', 1, 2, 1, 1, 4, 8),
('Notion', 'Latest', 'Office', 1, 2, 1, 1, 4, 8),
('Trello', 'Latest', 'Office', 1, 2, 1, 1, 4, 8),

-- Design Programs
('Figma', 'Latest', 'Design', 2, 4, 2, 4, 8, 16),
('Sketch', 'Latest', 'Design', 2, 4, 2, 4, 8, 16),
('Adobe Illustrator', '2024', 'Design', 2, 4, 2, 4, 8, 16),
('Adobe InDesign', '2024', 'Design', 2, 4, 2, 4, 8, 16),
('Affinity Designer', '2.0', 'Design', 2, 4, 2, 4, 8, 16),
('Affinity Photo', '2.0', 'Design', 2, 4, 2, 4, 8, 16),
('Affinity Publisher', '2.0', 'Design', 2, 4, 2, 4, 8, 16),
('Canva', 'Latest', 'Design', 1, 2, 1, 2, 4, 8),

-- Development Programs
('Visual Studio Code', 'Latest', 'Development', 2, 4, 1, 2, 8, 16),
('IntelliJ IDEA', '2023.3', 'Development', 4, 8, 2, 4, 8, 16),
('Android Studio', 'Latest', 'Development', 4, 8, 2, 4, 8, 16),
('Xcode', '15.0', 'Development', 4, 8, 2, 4, 8, 16),
('Docker Desktop', 'Latest', 'Development', 4, 8, 2, 4, 8, 16),
('Postman', 'Latest', 'Development', 2, 4, 1, 2, 4, 8),
('Git', 'Latest', 'Development', 1, 2, 1, 1, 4, 8),
('Node.js', 'Latest', 'Development', 2, 4, 1, 2, 4, 8);

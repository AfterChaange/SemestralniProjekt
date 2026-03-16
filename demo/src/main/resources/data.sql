-- Seed data for users table
INSERT INTO users (id, username, password, age, email, first_name, last_name) VALUES
                                                                                  ('550e8400-e29b-41d4-a716-446655440001', 'john_doe', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 28, 'john.doe@example.com', 'John', 'Doe'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440002', 'jane_smith', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 34, 'jane.smith@example.com', 'Jane', 'Smith'),
                                                                                   ('550e8400-e29b-41d4-a716-446655440003', 'bob_wilson', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 45, 'bob.wilson@example.com', 'Bob', 'Wilson'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440004', 'alice_johnson', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 31, 'alice.johnson@example.com', 'Alice', 'Johnson'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440005', 'charlie_brown', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 26, 'charlie.brown@example.com', 'Charlie', 'Brown');

INSERT INTO subjects (id, name, code, description, credits) VALUES
                                                                ('660e8400-e29b-41d4-a716-446655440001', 'Mathematics', 'MATH101', 'Basic mathematics course', 6),
                                                                ('660e8400-e29b-41d4-a716-446655440002', 'Physics', 'PHYS101', 'Intro to physics', 5),
                                                                ('660e8400-e29b-41d4-a716-446655440003', 'Computer Science', 'CS101', 'Programming basics', 6),
                                                                ('660e8400-e29b-41d4-a716-446655440004', 'History', 'HIST101', 'World history overview', 4),
                                                                ('660e8400-e29b-41d4-a716-446655440005', 'English', 'ENG101', 'English language course', 5);

INSERT INTO user_subject (user_id, subject_id) VALUES
                                                   ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'), -- John Doe -> Mathematics
                                                   ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003'), -- John Doe -> Computer Science
                                                   ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002'), -- Jane Smith -> Physics
                                                   ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005'), -- Jane Smith -> English
                                                   ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001'), -- Bob Wilson -> Mathematics
                                                   ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004'), -- Bob Wilson -> History
                                                   ('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003'), -- Alice Johnson -> Computer Science
                                                   ('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005'), -- Alice Johnson -> English
                                                   ('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002'), -- Charlie Brown -> Physics
                                                   ('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440004'); -- Charlie Brown -> History
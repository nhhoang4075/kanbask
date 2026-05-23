CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(255),
    role VARCHAR(30) DEFAULT 'user',
    last_active TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT FALSE,

    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_code VARCHAR(255),
    verification_expires TIMESTAMP WITH TIME ZONE,
    password_reset_code VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,

    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_verification_code ON users (verification_code);
CREATE INDEX idx_users_password_reset_code ON users (password_reset_code);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_team (
    user_id UUID REFERENCES users(id),
    team_id INT REFERENCES teams(id),
    role VARCHAR(30),
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
    project_id INT REFERENCES projects(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(30),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id),
    title VARCHAR(200) NOT NULL,
    statu VARCHAR(30) DEFAULT 'todo',
    priority VARCHAR(30),
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    due_date DATE,
    completed_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_comments (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    team_id INT REFERENCES teams(id),
    project_id INT REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_read_message_id INT REFERENCES messages(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    reference_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    action VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE VIEW users_public_view AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.avatar_url
FROM users u

CREATE OR REPLACE VIEW conversation_latest_activity_view AS
SELECT
    c.id AS conversation_id,
    c.type,
    c.team_id,
    c.project_id,
    c.created_at,
    lm.id AS latest_message_id,
    lm.content AS latest_message_content,
    lm.created_at AS latest_message_at,
    lm.sender_id AS latest_sender_id,
    u.full_name AS latest_sender_full_name
FROM conversations c
LEFT JOIN LATERAL (
    SELECT m.*
    FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
) lm ON TRUE
LEFT JOIN users u ON u.id = lm.sender_id;

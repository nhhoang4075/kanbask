CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(255),
    role VARCHAR(30) DEFAULT 'user',
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,

    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP
);

CREATE INDEX idx_users_verification_token ON users (verification_token);
CREATE INDEX idx_users_reset_token ON users (reset_token);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_team (
    user_id UUID REFERENCES users(id),
    team_id INT REFERENCES teams(id),
    role VARCHAR(30),
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_members (
    project_id INT REFERENCES projects(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(30),
    PRIMARY KEY (project_id, user_id)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id),
    title VARCHAR(200) NOT NULL,
    statu VARCHAR(30) DEFAULT 'todo',
    priority VARCHAR(30),
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id) NOT NULL,
    due_date DATE,
    completed_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_comments (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    team_id INT REFERENCES teams(id),
    project_id INT REFERENCES projects(id),
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_id INT REFERENCES conversations(id),
    user_id UUID REFERENCES users(id),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    statu VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    reference_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    action VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
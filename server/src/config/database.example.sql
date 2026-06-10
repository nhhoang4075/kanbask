-- =============================================
-- init_database.sql
-- =============================================

-- 1. DROP các view và bảng nếu đã tồn tại (để reset hoàn toàn)
DROP VIEW IF EXISTS conversation_latest_activity_view;
DROP VIEW IF EXISTS user_public_view;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS task_comments CASCADE;
DROP TABLE IF EXISTS task_assignees CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS team_join_requests CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS task_attachments;
DROP TABLE IF EXISTS message_attachments;
DROP TABLE IF EXISTS storage_attachments; 


-- =============================================
-- 1.a. Phân mở rộng vector
-- =============================================
CREATE EXTENSION IF NOT EXISTS VECTOR;

-- =============================================
-- 2. Bảng users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(255),
    role VARCHAR(30) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user','admin')),
    last_active TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    verification_code VARCHAR(255),
    verification_expires TIMESTAMP WITH TIME ZONE,
    password_reset_code VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    is_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    embedding VECTOR(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users (verification_code);
CREATE INDEX IF NOT EXISTS idx_users_password_reset_code ON users (password_reset_code);
CREATE INDEX IF NOT EXISTS idx_users_embedding_hnsw ON users USING hnsw (embedding vector_cosine_ops) WITH (M = 16, ef_construction = 64);

-- =============================================
-- 3. Bảng teams
-- =============================================
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    join_policy VARCHAR(20) NOT NULL DEFAULT 'manual'
        CHECK (join_policy IN ('auto','manual')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. Bảng team_members
-- =============================================
CREATE TABLE IF NOT EXISTS team_members (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'member'
        CHECK (role IN ('owner','admin','member')),
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, team_id)
);

-- =============================================
-- 5. Bảng team_join_requests
-- =============================================
CREATE TABLE IF NOT EXISTS team_join_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending','approved','rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_request
    ON team_join_requests(user_id, team_id)
    WHERE status = 'pending';

-- =============================================
-- 6. Bảng projects
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. Bảng project_members
-- =============================================
CREATE TABLE IF NOT EXISTS project_members (
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'member'
        CHECK (role IN ('owner','admin','member')),
    PRIMARY KEY (project_id, user_id)
);

-- =============================================
-- 8. Bảng tasks
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'todo'
        CHECK (status IN ('todo','in_progress','review','done','canceled')),
    priority VARCHAR(30),
    position INT NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    due_date DATE,
    completed_at DATE,
    embedding VECTOR(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_embedding_hnsw ON tasks USING hnsw (embedding vector_cosine_ops) WITH (M = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);

-- =============================================
-- 8.a. Bảng task_assignees
-- =============================================
CREATE TABLE IF NOT EXISTS task_assignees (
    task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_task_assignees_task ON task_assignees(task_id);

-- =============================================
-- 9. Bảng task_comments
-- =============================================
CREATE TABLE IF NOT EXISTS task_comments (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 10. Bảng conversations
-- =============================================
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL
        CHECK (type IN ('direct','team','project')),
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 11. Bảng messages
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_embedding_hnsw ON messages USING hnsw (embedding vector_cosine_ops) WITH (M = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages (sender_id);

-- =============================================
-- 12. Bảng conversation_participants
-- =============================================
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_read_message_id INT REFERENCES messages(id) ON DELETE SET NULL,
    last_read_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (conversation_id, user_id)
);

-- =============================================
-- 13. Bảng notifications
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    reference_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 14. Bảng activity_logs
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 15. Views
-- =============================================
-- 15.1. Public user view
CREATE OR REPLACE VIEW user_public_view AS
SELECT
    u.id,
    u.email,
    u.full_name,
    u.avatar_url
FROM users u;

-- 15.2. Conversation latest activity view
CREATE OR REPLACE VIEW conversation_latest_activity_view AS
SELECT
    c.id AS conversation_id,
    c.type,
    c.team_id,
    c.project_id,
    c.created_at AS conversation_created_at,
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

-- =============================================
-- 16. Bảng lưu trữ thông tin chung của tất cả các file đính kèm
-- =============================================

CREATE TABLE IF NOT EXISTS storage_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_path VARCHAR(1024) UNIQUE NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sa_uploaded_by_v2 ON storage_attachments (uploaded_by);
CREATE INDEX IF NOT EXISTS idx_sa_mime_type_v2 ON storage_attachments (mime_type);

-- =============================================
-- 17. Bảng liên kết giữa Task và File đính kèm
-- =============================================

CREATE TABLE IF NOT EXISTS task_attachments (
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    attachment_id UUID REFERENCES storage_attachments(id) ON DELETE CASCADE,
    attached_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Ai đã đính kèm
    attached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (task_id, attachment_id)
);
CREATE INDEX IF NOT EXISTS idx_ta_attachment_id ON task_attachments (attachment_id);

-- =============================================
-- 18. Bảng liên kết giữa Message và File đính kèm
-- =============================================

CREATE TABLE IF NOT EXISTS message_attachments (
    message_id INT REFERENCES messages(id) ON DELETE CASCADE,
    attachment_id UUID REFERENCES storage_attachments(id) ON DELETE CASCADE,
    attached_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Ai đã đính kèm
    attached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (message_id, attachment_id)
);
CREATE INDEX IF NOT EXISTS idx_ma_attachment_id ON message_attachments (attachment_id);

-- =============================================
-- END init_database.sql
-- =============================================

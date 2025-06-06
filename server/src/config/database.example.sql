CREATE EXTENSION IF NOT EXISTS VECTOR;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(255),
  role VARCHAR(30) NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
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

CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users (verification_code) WHERE verification_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_password_reset_code ON users (password_reset_code) WHERE password_reset_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_embedding_hnsw ON users USING hnsw (embedding vector_cosine_ops) WITH (M = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  description TEXT,
  join_policy VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (join_policy IN ('auto','manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teams_code ON teams (code);

CREATE TABLE IF NOT EXISTS team_members (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, team_id)
);

CREATE TABLE IF NOT EXISTS team_join_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_request ON team_join_requests(user_id, team_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_team_join_requests_team_id ON team_join_requests (team_id);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects (team_id);

CREATE TABLE IF NOT EXISTS project_members (
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(30) NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  status VARCHAR(30) DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done','canceled')),
  priority VARCHAR(30),
  description TEXT,
  position INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  embedding VECTOR(384),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_embedding_hnsw ON tasks USING hnsw (embedding vector_cosine_ops) WITH (M = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks (project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks (project_id, position);

CREATE TABLE IF NOT EXISTS task_assignees (
  task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_task_assignees_task_id ON task_assignees (task_id);

CREATE TABLE IF NOT EXISTS task_comments (
  id SERIAL PRIMARY KEY,
  task_id INT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments (task_id);

CREATE TABLE IF NOT EXISTS task_activity_logs (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES tasks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(30) NOT NULL CHECK (
    action IN (
      'create',
      'delete',
      'change_title',
      'change_due_date',
      'change_status',
      'comment',
      'attach'
    )
  ),
  details JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_log_task_id ON task_activity_logs (task_id);

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  type VARCHAR(30) NOT NULL CHECK (type IN ('direct','team','project')),
  team_id INT REFERENCES teams(id) ON DELETE CASCADE,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_pending BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_conversations_team_id ON conversations (team_id) WHERE team_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON conversations (project_id) WHERE project_id IS NOT NULL;

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

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id INT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_message_id INT REFERENCES messages(id) ON DELETE SET NULL,
  last_read_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_embedding_hnsw ON messages USING hnsw (embedding vector_cosine_ops) WITH (M = 16, ef_construction = 64);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages (sender_id);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  reference_type VARCHAR(30) NOT NULL CHECK (reference_type IN ('team','project','task')),
  reference_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_reference ON notifications (reference_type, reference_id) WHERE reference_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS storage_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_path TEXT UNIQUE NOT NULL,
  original_name TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sa_uploaded_by ON storage_attachments (uploaded_by);
CREATE INDEX IF NOT EXISTS idx_sa_mime_type ON storage_attachments (mime_type);

CREATE TABLE IF NOT EXISTS task_attachments (
  task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
  attachment_id UUID REFERENCES storage_attachments(id) ON DELETE CASCADE,
  attached_by UUID REFERENCES users(id) ON DELETE SET NULL,
  attached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (task_id, attachment_id)
);

CREATE INDEX IF NOT EXISTS idx_ta_attachment_id ON task_attachments (attachment_id);

CREATE TABLE IF NOT EXISTS message_attachments (
  message_id INT REFERENCES messages(id) ON DELETE CASCADE,
  attachment_id UUID REFERENCES storage_attachments(id) ON DELETE CASCADE,
  attached_by UUID REFERENCES users(id) ON DELETE SET NULL,
  attached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (message_id, attachment_id)
);

CREATE INDEX IF NOT EXISTS idx_ma_attachment_id ON message_attachments (attachment_id);

CREATE OR REPLACE VIEW user_public_view AS
SELECT id, email, full_name, avatar_url FROM users;

CREATE OR REPLACE VIEW conversation_latest_activity_view AS
SELECT
  c.id AS conversation_id,
  c.type,
  c.team_id,
  c.project_id,
  c.is_pending,
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

-- 先删除依赖于其他表的表
DROP TABLE IF EXISTS document_labels;
DROP TABLE IF EXISTS document_contents;
DROP TABLE IF EXISTS document_files;

-- 然后删除中间依赖的表
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS labels;

-- 最后删除基础表
DROP TABLE IF EXISTS users;

-- 创建用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建文档表
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'image', 'file')),
    creator_id INTEGER NOT NULL REFERENCES users(id),
    favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建标签表
CREATE TABLE labels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) DEFAULT '#808080',
    creator_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, creator_id)
);

-- 创建文档标签关联表
CREATE TABLE document_labels (
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    CONSTRAINT pk PRIMARY KEY (document_id, label_id)
);

-- 创建文本内容表（仅用于文本类型文档）
CREATE TABLE document_contents (
    document_id INTEGER PRIMARY KEY NOT NULL UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

-- 创建文件引用表（用于图片和文件类型文档）
CREATE TABLE document_files (
    document_id INTEGER PRIMARY KEY NOT NULL UNIQUE REFERENCES documents(id) ON DELETE CASCADE,
    storage_path VARCHAR(255) NOT NULL,  -- 存储系统中的路径
    filename VARCHAR(255) NOT NULL,      -- 原始文件名
    file_type VARCHAR(50)               -- 文件类型
);

-- 创建索引以提高查询性能
CREATE INDEX idx_documents_creator ON documents(creator_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_favorite ON documents(favorite);
CREATE INDEX idx_document_labels_document ON document_labels(document_id);
CREATE INDEX idx_document_labels_label ON document_labels(label_id);
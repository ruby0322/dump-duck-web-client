-- 插入使用者資料
INSERT INTO users (username, email, password_hash, display_name) VALUES
('user01', 'user01@example.com', 'password_hash_01', '使用者一'),
('user02', 'user02@example.com', 'password_hash_02', '使用者二'),
('user03', 'user03@example.com', 'password_hash_03', '使用者三'),
('user04', 'user04@example.com', 'password_hash_04', '使用者四'),
('user05', 'user05@example.com', 'password_hash_05', '使用者五');

-- 插入使用者 1 的標籤資料
INSERT INTO labels (id, name, color, creator_id) VALUES
(1, '重要', '#ff6347', 1),
(2, '待辦', '#4682b4', 1),
(3, '閱讀', '#32cd32', 1),
(4, '設計', '#ffa500', 1),
(5, '財務', '#8a2be2', 1);

-- 插入使用者 2 的標籤資料
INSERT INTO labels (id, name, color, creator_id) VALUES
(6, '學習', '#ff6347', 2),
(7, '專案', '#4682b4', 2),
(8, '攝影', '#32cd32', 2),
(9, '簡歷', '#ffa500', 2),
(10, '學術', '#8a2be2', 2);

-- 插入使用者 3 的標籤資料
INSERT INTO labels (id, name, color, creator_id) VALUES
(11, '設計', '#ff6347', 3),
(12, '開發', '#4682b4', 3),
(13, '新聞', '#32cd32', 3),
(14, '培訓', '#ffa500', 3),
(15, '產品', '#8a2be2', 3);

-- 插入使用者 4 的標籤資料
INSERT INTO labels (id, name, color, creator_id) VALUES
(16, '行銷', '#ff6347', 4),
(17, '旅行', '#4682b4', 4),
(18, '專案', '#32cd32', 4),
(19, '合同', '#ffa500', 4),
(20, '筆記', '#8a2be2', 4);

-- 插入使用者 5 的標籤資料
INSERT INTO labels (id, name, color, creator_id) VALUES
(21, '年度報告', '#ff6347', 5),
(22, '錄音', '#4682b4', 5),
(23, '設計', '#32cd32', 5),
(24, '創業', '#ffa500', 5),
(25, '演示', '#8a2be2', 5);

-- 插入文件資料
INSERT INTO documents (title, description, type, creator_id, favorite) VALUES
-- 使用者一的文件
('會議記錄', '這是 2024 年 1 月的會議記錄', 'text', 1, TRUE),
('業務報告', '關於本季度的業務報告', 'text', 1, FALSE),
('公司簡介', '我們公司的背景介紹文件', 'file', 1, FALSE),
('設計提案', 'UI 設計提案文檔', 'text', 1, TRUE),
('財務報表', '2024 年的財務數據報告', 'text', 1, TRUE),
-- 使用者二的文件
('學習筆記', '這是我學習資料庫的筆記', 'text', 2, FALSE),
('專案計劃書', '專案的計劃書和時間表', 'text', 2, TRUE),
('照片集', '一些攝影作品的照片集', 'image', 2, TRUE),
('求職簡歷', '我的最新求職簡歷', 'file', 2, FALSE),
('學術文章', '這篇文章探討資料結構的理論', 'text', 2, TRUE),
-- 使用者三的文件
('設計稿', '設計草圖和原型圖', 'image', 3, FALSE),
('開發手冊', '程式開發的指南手冊', 'file', 3, TRUE),
('新聞稿', '公司新聞和公告', 'text', 3, FALSE),
('培訓課程', '線上學習平台的培訓課程', 'text', 3, TRUE),
('產品目錄', '最新產品的介紹', 'file', 3, TRUE),
-- 使用者四的文件
('行銷計劃', '行銷活動的詳細計劃', 'text', 4, TRUE),
('照片集', '我的旅行照片集', 'image', 4, FALSE),
('專案報告', '專案進度報告', 'text', 4, TRUE),
('合同文件', '商業合作合同文檔', 'file', 4, FALSE),
('筆記摘要', '閱讀過的書籍筆記摘要', 'text', 4, TRUE),
-- 使用者五的文件
('年度報告', '公司 2024 年的總結報告', 'text', 5, TRUE),
('會議錄音', '錄音文件，用於會議回顧', 'file', 5, FALSE),
('項目設計', '項目的設計方案文檔', 'text', 5, TRUE),
('商業計劃書', '為創業項目編寫的商業計劃書', 'text', 5, FALSE),
('演示文稿', 'PPT 演示文稿', 'file', 5, TRUE);

-- 插入文檔內容資料（僅對文本類型的文件插入內容）
INSERT INTO document_contents (document_id, content) VALUES
-- 使用者一的文件內容
(1, '2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。2024 年 1 月會議的主要議題包括產品開發、行銷策略等，大家對於未來的方向提出了建設性建議。
[簡報連結](https://www.canva.com/design/DAGj72D69yc/6ShIZumOel_9nJKjNTwtUg/edit?utm_content=DAGj72D69yc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)'),
(2, '本季度的業務報告顯示，公司營收有顯著增長，主要來自新產品的銷售。'),
(4, '設計提案包括 UI 介面的更新、用戶體驗的提升方案等，預計下月進行原型測試。'),
(5, '2024 年的財務報表顯示，公司在各項目標上均達成預期，具體數字見附件。'),
-- 使用者二的文件內容
(6, '學習資料庫的筆記，主要記錄了關於索引、查詢優化等方面的內容。'),
(7, '專案計劃書詳細描述了每個階段的時間表和資源需求，並對潛在風險進行了預測。'),
(10, '這篇學術文章深入探討了資料結構的基礎理論，並進行了大量的實驗分析。'),
-- 使用者三的文件內容
(13, '這篇新聞稿是為了發布我們公司最新的技術成果，並介紹我們的未來計劃。'),
(14, '培訓課程包括多個不同的主題，從基礎的程式設計到高級的數據分析技巧。'),
-- 使用者四的文件內容
(16, '行銷計劃針對不同市場的需求提出了行銷策略，並且詳細描述了執行步驟。'),
(18, '專案報告更新了專案的進度，包括各個子任務的完成情況。'),
(19, '合同文件涉及與其他公司達成的合作協議，並規範了雙方的權利與義務。'),
(20, '這些筆記是我閱讀各種書籍後的心得，總結了書中的精華部分。'),
-- 使用者五的文件內容
(21, '年度報告詳細介紹了公司過去一年的各項業務發展，並對未來做出了預測。'),
(23, '項目設計方案包括了項目的目標、設計理念和預期的實施計劃。'),
(24, '商業計劃書概述了創業項目的核心價值和商業模式，並詳細分析了市場競爭。');

-- 插入文檔標籤關聯資料（每個文件至少一個標籤）
INSERT INTO document_labels (document_id, label_id) VALUES
-- 使用者一的標籤關聯
(1, 1), (2, 2), (3, 3), (4, 4), (5, 5),
-- 使用者二的標籤關聯
(6, 1), (7, 2), (8, 3), (9, 4), (10, 5),
-- 使用者三的標籤關聯
(11, 1), (12, 2), (13, 3), (14, 4), (15, 5),
-- 使用者四的標籤關聯
(16, 1), (17, 2), (18, 3), (19, 4), (20, 5),
-- 使用者五的標籤關聯
(21, 1), (22, 2), (23, 3), (24, 4), (25, 5);

-- 插入文檔文件關聯資料
INSERT INTO document_files (document_id, storage_path, filename) VALUES
(3, 'uploads/documents/1/company_intro.pdf', 'company_intro.pdf'),
(8, 'uploads/documents/2/photobook.zip', 'photobook.zip'),
(12, 'uploads/documents/3/designs.zip', 'designs.zip'),
(17, 'uploads/documents/4/marketing_plan.pdf', 'marketing_plan.pdf'),
(22, 'uploads/documents/5/business_plan.pdf', 'business_plan.pdf');
DROP TABLE news_tags;
DROP TABLE news;
DROP TABLE tags;

CREATE TABLE news(
	id serial PRIMARY KEY,
	title text NOT NULL,
	url text NOT NULL,
	votes integer NOT NULL DEFAULT 0
);

CREATE TABLE tags(
	id serial PRIMARY KEY,
	tag text NOT NULL
);

CREATE TABLE news_tags (
	news_id INTEGER NOT NULL REFERENCES news ON DELETE CASCADE,
	tags_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);

INSERT INTO news (title, url, votes) VALUES
('Newsflash', 'http://allthenews.com/newsflashstory', 3),
('Update on the situation in Caracas', 'http://allthenews.com/caracasStory', 6),
('No news here', 'http://centralnews.com/wegotnothing', 7),
('10 signs you might be alive', 'http://www.theshallowthinker.net', 4),
('Why health insurance is bad for your health', 'http://www.jama.org', 2),
('10 cities you will love (if you survive)', 'http://www.roguetraveler.net', 2);

INSERT INTO tags (tag) VALUES
('news'),
('travel'),
('weather'),
('health'),
('lifestyle');

INSERT INTO news_tags (news_id, tags_id) VALUES
(1,1),
(1,4),
(2,2),
(2,3),
(2,4),
(3,1),
(3,2),
(3,5),
(4,1),
(4,2),
(5,2),
(5,3),
(5,4),
(6,1),
(6,3),
(6,5);



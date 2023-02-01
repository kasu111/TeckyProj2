        
CREATE TABLE ads
(
  id    serial NOT NULL,
  image text   NULL    ,
  PRIMARY KEY (id)
);

CREATE TABLE comment_like
(
  id         serial NOT NULL,
  user_id    SERIAL NOT NULL,
  comment_id Serial NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE comments
(
  id               Serial    NOT NULL,
  body             TEXT      NOT NULL,
  photo            TEXT      NULL    ,
  user_id          SERIAL    NOT NULL,
  post_id          SERIAL    NOT NULL,
  write_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_first_comment BOOLEAN   NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

CREATE TABLE posts
(
  id         SERIAL    NOT NULL,
  title      TEXT      NOT NULL,
  user_id    SERIAL    NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL    ,
  PRIMARY KEY (id)
);

CREATE TABLE REF_notification_users_post
(
  id      serial NOT NULL,
  user_id SERIAL NOT NULL,
  post_id SERIAL NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users
(
  id              SERIAL    NOT NULL,
  name            VARCHAR   NOT NULL,
  password        VARCHAR   NOT NULL,
  sex             BOOLEAN   NOT NULL DEFAULT true,
  registered_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status_admin    BOOLEAN   NOT NULL DEFAULT false,
  VIP             BOOLEAN   NOT NULL DEFAULT false,
  PRIMARY KEY (id)
);

ALTER TABLE posts
  ADD CONSTRAINT FK_users_TO_posts
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE comments
  ADD CONSTRAINT FK_users_TO_comments
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE comments
  ADD CONSTRAINT FK_posts_TO_comments
    FOREIGN KEY (post_id)
    REFERENCES posts (id);

ALTER TABLE comment_like
  ADD CONSTRAINT FK_users_TO_comment_like
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE comment_like
  ADD CONSTRAINT FK_comments_TO_comment_like
    FOREIGN KEY (comment_id)
    REFERENCES comments (id);

ALTER TABLE REF_notification_users_post
  ADD CONSTRAINT FK_users_TO_REF_notification_users_post
    FOREIGN KEY (user_id)
    REFERENCES users (id);

ALTER TABLE REF_notification_users_post
  ADD CONSTRAINT FK_posts_TO_REF_notification_users_post
    FOREIGN KEY (post_id)
    REFERENCES posts (id);

        
      
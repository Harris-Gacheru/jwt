-- ####create post
-- CREATE OR ALTER PROCEDURE createPost (@post_title VARCHAR(50), @post VARCHAR(255), @user_id INT)
-- AS
-- BEGIN

-- INSERT INTO posts (post_title, post, user_id)
-- VALUES(@post_title, @post, @user_id)

-- END


-- #####get posts
CREATE OR ALTER PROCEDURE getPosts (@user_id INT)
AS
BEGIN

SELECT * FROM posts WHERE user_id = @user_id
ORDER BY created_at DESC

END
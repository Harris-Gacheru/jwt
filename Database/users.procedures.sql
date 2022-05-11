-- create  user
-- CREATE OR ALTER PROCEDURE createUser (@user_name VARCHAR(100), @user_email VARCHAR(50), @user_pwd VARCHAR(255))
-- AS 
-- BEGIN

-- INSERT INTO users(user_name, user_email, user_pwd)
-- VALUES(@user_name, @user_email, @user_pwd)

-- END

-- exec createUser @user_name = 'Harris', @user_email = 'harris@gmail.com', @user_pwd = '12345'
-- select * from users

-- ####get user
-- CREATE OR ALTER PROCEDURE getUser (@email VARCHAR(50))
-- AS
-- BEGIN 

-- SELECT * FROM users WHERE user_email = @email

-- END

-- #####get users
CREATE OR ALTER PROCEDURE getUsers 
AS
BEGIN 

SELECT user_id, user_name, user_email, created_at FROM users

END
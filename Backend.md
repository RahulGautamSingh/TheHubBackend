Backend Info goes here/

Work Done: 

Created User Model with -> name,email,password and refresh_token fields

Created User Controller -> implementeed the functions for creatinf new user, updating refresh_token , refreshing   access_token and finding User

Created express server and made routes for /login,/signup,/token,/logout
---------------------------------------------------------------
Details about server endpoints:
/signup

-POST req :JSON object containing username,email and password 
--
/login

-POST req :JSON object containing username and password
--

/logout

-POST req :JSON object containing username
--

/token

-Port requ:Header with refresh_token 
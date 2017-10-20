# Snippets Box
[https://zhw2590582.github.io/snippets-box/](https://zhw2590582.github.io/snippets-box/)
![N1 Screenshot](https://raw.githubusercontent.com/zhw2590582/snippets-box/master/screenshot/01.png)


## Want to host this repository on your github pages ?

### Step 1) Fork this Repository
Fork it.
then you can get your **Homepage URL** like: https://github.com/you-name/snippets-box

### Step 2) Creat you GitHub Pages in the Settings page
Built from the /docs folder in the master branch.
then you can get your **Authorization callback URL** like: https://you-name.github.io/snippets-box/

### Step 3) Creat A Github OAuth App. 
Open [https://github.com/settings/applications/new](https://github.com/settings/applications/new) register a new OAuth application.
then you can get you **Client ID** and **Client Secret**

### Step 4) Clone you Repository
Change the configuration In the **snippets-box/src/config/index.js** file.
client_id     ==> Your Client ID
client_secret ==> Your Client Secret
redirect_uri  ==> Your Authorization callback URL
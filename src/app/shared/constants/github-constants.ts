export class GitHubConstants {

    /* KEYS */
    static KEY_USERNAME = "{username}";
    
    
    /* API URLs */
    static BASE_URL = "https://api.github.com";

    static USER = "/users/" + this.KEY_USERNAME;
    static USER_REPOS = "/users/" + this.KEY_USERNAME + "/repos"


    /* SWITCH OPTIONS */
    static CASE_REPOS     = 1;
    static CASE_GISTS     = 2;
    static CASE_FOLLOWERS = 3;
    static CASE_FOLLOWING = 4;
    
}
export class GitHubConstants {

    /* ----------- API ----------- */
    /* KEYS */
    static KEY_USERNAME = "{username}";
    
    /* URLs */
    static BASE_URL = "https://api.github.com";

    static USER = "/users/" + this.KEY_USERNAME;
    static USER_REPOS = "/users/" + this.KEY_USERNAME + "/repos"

    /* ----------- UTIL ----------- */
    /* SECTION CASES */
    static CASE_REPOS     = 1;
    static CASE_GISTS     = 2;
    static CASE_FOLLOWERS = 3;
    static CASE_FOLLOWING = 4;


    /* ----- LOCAL STORAGE KEYS ----- */
    static LS_GITHUB_RECENT_USERNAMES = 'github_usuarios_recientes';
}
import { GitHubFilesInterface } from "./github-files.interface";
import { GitHubBasicUserInterface } from "./github-basicuser.interface";

export interface GitHubGistInterface {
    url:          string;
    forks_url:    string;
    commits_url:  string;
    id:           string;
    node_id:      string;
    git_pull_url: string;
    git_push_url: string;
    html_url:     string;
    files:        GitHubFilesInterface;
    filesNames?:  string;
    public:       boolean;
    created_at:   string;
    updated_at:   string;
    description:  string;
    comments:     number;
    user:         null;
    comments_url: string;
    owner:        GitHubBasicUserInterface;
    truncated:    boolean;
}
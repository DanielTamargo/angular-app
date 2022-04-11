export interface GitHubFilesInterface {
    [key: string]: GitHubFileInterface;
}

export interface GitHubFileInterface {
    filename: string;
    type:     string;
    language: string;
    raw_url:  string;
    size:     number;
}
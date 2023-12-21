import fs from 'fs/promises';
import axios from 'axios';

const PROMYZE_URL= "TO_FILL"
const API_KEY= "TO_FILL"

class IO {
    async getFileContent(path: string): Promise<string> {
        try {
            const content = await fs.readFile(path);
            return content.toString();
        } catch (error) {
            console.log(error);
            return '';
        }
    }
}

class HttpAPI {
    private readonly promyzeURLAnalysis: string = '/api/plugin/cli/suggestion/batch/negative';
    constructor(
            private readonly promyzeURL: string,
            private readonly apiKey: string) {
    }

    async postData(fileName: string, content: string, extension: string,): Promise<any> {
        const formattedPayload = [{
            fileId: fileName,
            data: {
                fileName: fileName,
                content: content,
                extension: extension,
            }
        }];
        const data = JSON.stringify({
            files: formattedPayload
        });
        const url = this.promyzeURL + this.promyzeURLAnalysis;
        console.log("url ", url);
        const httpConfig = {
            method: 'post',
            url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'promyze-api-key': this.apiKey,
            },
            data: data,
        };
        const response = await this.axiosRequest(httpConfig);
        console.log(`${response} results found`);
    }

    async axiosRequest(httpConfig: any): Promise<any> {
        const response = await axios.request(httpConfig);
        const result = response.data[0].data.length;
        return result;
    }
}

const file = "script.ts";
const extension = ".ts";
const io: IO = new IO();
io.getFileContent(file)
    .then(content => {
        const httpApi = new HttpAPI(PROMYZE_URL, API_KEY);
        httpApi.postData(file, content, extension)
            .then(() => console.log("Analysis over"))
            .catch(error => console.error(error));
    }).catch(error => console.error(error));
import router from '../router';
import {Request, Response} from "express";
import {IError} from '../../domain/IError';
import fs from 'fs-extra';
import path from 'path';

class Word {
    cnt: number;
    key: string;
    constructor(cnt: number, key: string ) {
        this.key = key;
        this.cnt = cnt;
    }
}

let frequencies: Array<any> = [];
function isContain(obj: any) {
    for(var index in frequencies) {
        let _word = frequencies[index];
        if(_word.key == obj.key) {
            return index;
        }
    }
    return -1;
}

function parseWordFromString(obj: string) {
    if (typeof obj === "string") {
        let words: Array<string> = obj.split(" ");
        for(var index in words) {
            if(words[index] == "") {
                continue;
            }
            let _word = new Word(1, words[index]);
            let containindex: any = isContain(_word);
            if(containindex == -1) {
                frequencies.push(_word);
            } else {
                frequencies[containindex].cnt++;
            }
        }
    }
}

function sort(array: any) {
    var sortedArray: Array<any>[] = array.sort((n1:Word, n2:Word) => {
        if (n1.cnt < n2.cnt) {
            return 1;
        }
        if (n1.cnt > n2.cnt) {
            return -1;
        }
        return 0;
    });

    return sortedArray;
}

router.route('/test')
    .post(async (req: Request, res: Response) => {
        const uploadPath = path.join(__dirname, 'fu/');
        try 
        {
            fs.ensureDir(uploadPath);
            req.pipe(req.busboy); // Pipe it trough busboy

            req.busboy.on('file', (fieldname, file, fileInfo) => {
                // console.log(`Upload of '${fileInfo.filename}' started`);
                const fullPath = path.join(uploadPath, fileInfo.filename);

                // Create a write stream of the new file
                const fstream = fs.createWriteStream(fullPath);

                // Pipe it trough
                file.pipe(fstream);

                // On finish of the upload
                fstream.on('close', () => {
                    // console.log(`Upload of '${fieldname}' finished`);
                    var lineReader = require('readline').createInterface({
                        input: require('fs').createReadStream(fullPath)
                    });

                    lineReader.on('line', function (line: any) {
                        parseWordFromString(line);
                    });

                    lineReader.on('close', function () {
                        return res.status(201).json({list: sort(frequencies)});
                    });
                    
                });
            });
        } catch (e) {
            const error: IError = {
                status: 500,
                message: "An error happened!"
            }
            console.error(e);
            res.status(error.status).json({message: "An error happened"});
        }
    });
    
export default router;

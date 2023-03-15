/** File Upload multipart/form-data */

const logger = require('../log/logger')
const colors = require('../log/colors')
function log(...str) {
    logger(colors.cyan("MulterManager.js:"), ...str)
}

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const customStorage = require('./custom-storage');

/**
 * @clearTmpTime - время в миллисекундах, по истечению которого временный файл удаляются (по ум. 5 часов).
 * @clearTmpIntervalTime - время в миллисекундах, частота проверки истечения срока жизни временных файлов (по ум. 1 сек).
 * @tmpDir - месторасположение временных файлов (по ум. "tmp/").
 * @dstDir - месторасположение постоянных файлов (по ум. "data/").
 * */
module.exports = class MulterManager {

    #clearTmpTime;
    #clearTmpIntervalTime;
    #tmpDir;
    #dstDir;
    #storage;
    #clearTmpInterval;

    constructor(opts={}) {
        log("Initialize Multer Manager");

        /* Default values */
        this.#clearTmpTime = opts.clearTmpTime || 1000 * 60 * 60 * 5; // 5 hours
        this.#clearTmpIntervalTime = opts.clearTmpIntervalTime || 1000 * 60 * 10; // 10 minute
        this.#tmpDir = opts.tmpDir || path.join('tmp');
        this.#dstDir = opts.dstDir || path.join('data');

        fs.promises.mkdir(this.#tmpDir, { recursive: true }).catch(err=>{});
        fs.promises.mkdir(this.#dstDir, { recursive: true }).catch(err=>{});

        this.#storage = customStorage({ tmpDir: this.#tmpDir, dstDir: this.#dstDir });
    }

    startClearInterval(){
        log("start clear interval")
        // Очистить папку буфера файлов полностью на старте
        this._clearTemp({ force: true });
        const that = this;
        // Каждую N времени проверять истек ли срок хранения какого файла
        this.#clearTmpInterval = setInterval(() => {
            that._clearTemp({ force: false })
        }, this.#clearTmpIntervalTime);
    }
    stopClearInterval(){
        log("stop clear interval")
        // Очистить папку буфера файлов полностью
        this._clearTemp({ force: true });
        clearInterval(this.#clearTmpInterval)
    }

    async _clearTemp({ force }){
        try{
            const files = await fs.promises.readdir(this.#tmpDir);

            const date = Date.now();

            await Promise.all(files.map(async file => {
                const filepath = path.join(this.#tmpDir, file);
                const stats = await fs.promises.stat(filepath);


                if(stats.isDirectory()){
                    const expired = date - stats.birthtimeMs >= this.#clearTmpTime;

                    // log(file, stats.isFile() ? 'file' : 'directory', force || expired ? 'delete' : '');

                    // Проверяем, что папка создана больше n времени назад.
                    // Название каждой папки - время создания в миллисекундах, но лучше использовать время создания напрямую.

                    if(force || expired){
                        // fs.rm recursive force удаляет все в папке и не выводит ошибок.
                        // Вместо fs.rm аналогично можно было бы рекурсивно пользоваться fs.rmdir и fs.unlink.
                        await fs.promises.rm(filepath, { recursive: true, force: true });
                        log("delete", filepath)
                    }
                }
            }))
        }
        catch(err){
            log(err);
        }
    }

    /**
     * @filters - multer middleware field.
     * @limits - multer middleware field.
     * @fields - names and number of fields of files to be downloaded.
     *  */
    middleware(opts={}){
        const uploadOptions = { storage: this.#storage };
        if(opts.filters) {
            uploadOptions.filters = opts.filters;
        }
        if(opts.limits) {
            uploadOptions.limits = opts.limits;
        }

        const upload = multer(uploadOptions);

        let uploader;

        if(opts.fields){ //[{ name: 'avatar', maxCount: 1 }]
            uploader = upload.fields(opts.fields);
        } else {
            uploader = upload.any();
        }

        return function(req, res, next){
            uploader(req, res, function(){
                const files = {};
                req.files.map(file => {
                    files[file.fieldname] = file;
                })
                req.files = files;
                next();
            })
        }
    }
}



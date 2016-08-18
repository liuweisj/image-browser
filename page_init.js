/**
 * Created by lw on 16/7/23.
 */
;(function (window) {
    let $ = window.jQuery;
    let replaceLink = function () {
        let target = $(".falls_container ul li .img");
        target.each(function () {
            let _this = $(this);
            let href = _this.attr("href");
            _this.attr("href","javascript:void(0);");
            _this.click(function () {
                if(href!="javascript:void(0);"){
                    console.log(href);
                    let imageURLs = getImageListURL(href);

                }
            })

        })
    }
    let getImageURL = function (imageURL) {
        return new Promise(function (resolve,reject) {
            if(!imageURL){
                reject()
                return;
            };

            let cheerio = require("cheerio");
            let http = require("http");
            http.get(imageURL,function (res) {
                let datas = [];
                let size = 0;
                res.on('data', function (data) {
                    datas.push(data);
                    size += data.length;
                });
                res.on("end", function () {
                    let buff = Buffer.concat(datas, size);
                    let chunk = buff.toString()
                    let $ = cheerio.load(chunk);
                    let reg = new RegExp(/(\d*\/\d*)/);
                    let text =$(".pageheader h2").html()
                    let val = reg.exec(text);
                    if(!val)return;
                    val = val[0];
                    let num = val.split("/")[1]
                    let imgURL = $(".IMG_show").attr("src");
                    let rst = {"pages":num,imgURL:imgURL}
                    resolve(rst);
                });

            })
        });
    }
    let getImageListURL = function (pageURL) {
        let imageURLArray = [];
        getImageURL(pageURL).then(function (res) {
            let imagePageURL = pageURL.substring(0,pageURL.lastIndexOf("_")+1);

            let imageObj = {from:pageURL,imageURL:res.imgURL};
            imageURLArray.push(imageObj);
            sendMsgToMain(imageObj)
            let maxPage = res.pages;
            for(let i =2;i<=maxPage;i++){
                let url = imagePageURL+i+".html";
                getImageURL(url).then(function (res) {
                    let imageObj = {from:url,imageURL:res.imgURL};
                    imageURLArray.push(imageObj)
                    sendMsgToMain(imageObj);
                })
            }
        });
    }

    var sendMsgToMain = function (msg) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('image-msg', msg)
    }

    window.imageMatch = {
        init : function () {
            $ = window.jQuery;
            if(!$)return;
            $(".g-header").hide();
            $(".ad1").hide();
            $(".listcontent").hide();
            $(".bottom").hide();
            $(".logo-wrap").hide();
            $("#header").height("38px");
            $("#footer").hide();
            $("iframe").remove();
            replaceLink();
        }
    }

}(window));

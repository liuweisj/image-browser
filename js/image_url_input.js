/**
 * Created by grant on 16/8/18.
 */
$(function () {
    var sendMsgToMain = function (msg) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('image-msg', msg)
    }

    $("#viewBtn").on("click",function () {
        let urls = $("#text").val()
        urls = urls.split(/,|\n/);
        urls.forEach(function (v,k) {
            if(v&&v.trim()){
                sendMsgToMain({
                    from:"",
                    imageURL:v.trim()
                })
            }
        })
    })
})
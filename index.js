const express = require('express');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get("/", function (req,res) {
    res.status(200).render("index", {QR_code: ""});
})

app.post("/", function (req, res) {
    const url = req.body.url;
    if(url) {
        qrcode.toDataURL(url, function(err, file) {
            if(err) {
                console.log("Error", err);
            } else {
                console.log("File",file);
                let file_path = 'collection/' + Date.now() + '.png';
                console.log("File path",file_path);
                qrcode.toFile(file_path, url, {
                    color: {
                        dark: '#00F',  // Blue dots
                        light: '#0000' // Transparent background
                    }
                });
                res.render("index", {QR_code: file, img_src: file_path});
            }
        })
    } else {
        res.send("Url not set")
    }
});

app.get("/download", function(req,res) {
    console.log(req.query);
    res.download(req.query.file_path);
})


app.listen(3000, function() {
    console.log("Server is running on port 3000");
})
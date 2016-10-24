//var CryptoJS = require("crypto-js");
function showSlide(id) {
    $(".slide").hide();
    $("#" + id).show();
}

var experiment = {

    confirm: function () {

        if (document.getElementById("email").value) {

            data = document.getElementById("email").value;
            key = "ejyoon";

            decryptedData = CryptoJS.AES.decrypt(data, key);
            originalData = decryptedData.toString(CryptoJS.enc.Utf8);



            //
            //var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
            //var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            //$("#answer").html(decryptedData);
            console.log(originalData)

            // Decode the base64 data so we can separate iv and crypt text.
            //var rawData = atob(data);
            //var iv = btoa(rawData.substring(0,16));
            //var crypttext = btoa(rawData.substring(16));
            //
            //// Decrypt...
            //var plaintextArray = CryptoJS.AES.decrypt(
            //  {
            //    ciphertext: CryptoJS.enc.Base64.parse(crypttext),
            //    salt: ""
            //  },
            //  CryptoJS.enc.Hex.parse(key),
            //  { iv: CryptoJS.enc.Base64.parse(iv) }
            //);
            //
            //// Convert hex string to ASCII.
            //// See http://stackoverflow.com/questions/11889329/word-array-to-string
            //function hex2a(hex) {
            //    var str = '';
            //    for (var i = 0; i < hex.length; i += 2)
            //        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            //    return str;
            //}
            //
            //console.log(hex2a(plaintextArray.toString()));
        }
    }
};


        const fs = require('fs');

//saves data into a text log, which it can also give to the user to read using special Route
export default class Logger {

    static myInstance = null;

    _funds = "";
    _name="";
    _id="";
    _Log="";
    _rerun=true;
    _qb=false;
    _prompt="";



    /**
     * @returns {Logger}
     */
    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new Logger();
        }

        return this.myInstance;
    }

    logEvent(event){
        var date= new Date(Date.now())
        var line=date.toDateString() + "    "+event+"\n"
        fs.appendFile('./text/Log.txt', line, 'utf-8', err => {
          if (err) {
            throw err;
          }
        });
    }

    getLog(){

    }

    readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}

   

}
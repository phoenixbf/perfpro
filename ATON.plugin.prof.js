window.addEventListener('load',() => {

    let TR = new ATON.Plugin();

    let PP   = new URLSearchParams(window.location.search);
    let rdur = PP.get('rdur');
    if (!rdur) return;

    TR.reset = ()=>{
        //TR.marks = [];

        TR._tStart = undefined;
        TR._t      = 0.0;
        TR._tDur   = 10;
        
        TR._rCount = 0;

        TR._csvdata = "Time, FPS, TileSets, Tiles, Geometries, Textures";
        TR._data = [];

        TR._fname = "profile.csv";
        TR._sid   = undefined;
    };

    TR.setup = ()=>{
        TR.reset();

        ATON.App._id = "_prof";

        TR._rMax = parseInt(rdur);

        ATON.on("SceneJSONLoaded", sid =>{
            TR._sid = sid.replace("/","_");
            TR._fname = "profile-"+TR._sid+".csv";
        });

        ATON.on("XRmode", b =>{
            TR.reset();

            if (b){
                if (TR._sid !== undefined) TR._fname = "profile-"+TR._sid+"-xr.csv";
                TR._fname = "profile-xr.csv";
            }
        });
    };

    TR.update = ()=>{
        if (TR._rCount < 0) return;
        if (ATON._dt < 0.0) return;
        if (ATON._dtCount > 0.0) return;

        //TR._t = ATON.getElapsedTime();
        //if (TR._tStart === undefined) TR._tStart = TR._t;

        let info = ATON._renderer.info;

        //if (TR._t > (TR._tStart + TR._tDur)){
        if (TR._rCount >= TR._rMax){
            TR._rCount = -1;
            

            ATON.Utils.downloadText(TR._csvdata, TR._fname);
            //console.log(TR._data)
/*
            ATON.App.addToStorage(TR._sid, TR._data).then(()=>{
                console.log("Data recorded");
            });
*/
            return;
        }

        let str = "\n";
        str += ATON.getElapsedTime().toPrecision(2) + ",";
        str += ATON._fps.toPrecision(2) + ",";
        str += ATON.MRes._numTSLoaded + ",";
        str += ATON.MRes._numTilesLoaded + ",";
        str += info.memory.geometries + ",";
        str += info.memory.textures;

        TR._data.push({
            time: ATON.getElapsedTime().toPrecision(2),
            fps: ATON._fps.toPrecision(2),
            tilesets: ATON.MRes._numTSLoaded,
            tiles: ATON.MRes._numTilesLoaded,
            geometries: info.memory.geometries,
            textures: info.memory.textures
        });
        
        TR._csvdata += str;
        //TR.marks.push(R);

        //console.log(str);

        TR._rCount++;
    };

    ATON.registerPlugin( TR );
});
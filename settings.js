const textarea = document.getElementById("nickname-map");


const DEFAULT_MAP = `alex     = alexander
andy     = andrew
annette  = yvonne
ben      = benjamin
benny    = benjamin
bill     = william
billy    = william
bob      = robert
bobby    = robert
brett    = brett
cam      = cameron
carson   = robert
chad     = donald
chris    = christopher
claire   = ivy
cole     = adam
dan      = daniel
danny    = daniel
dave     = david
davy     = david
doug     = douglas
ed       = edward
eddie    = edward
frank    = francis
fred     = frederick
greg     = gregory
ian      = ian
jack     = john
jake     = jacob
jamie    = james
jen      = jennifer
jenn     = jennifer
jenny    = jennifer
jim      = james
jimmy    = james
joe      = joseph
joey     = joseph
johnny   = john
josh     = joshua
kat      = katherine
kate     = katherine
katie    = katharine
ken      = kenneth
kenny    = kenneth
kris     = kristopher
liz      = elizabeth
lizzy    = elizabeth
maddie   = madison
maegen   = maegan
matt     = matthew
mattie   = matthew
max      = maxwell
michael  = michael
mike     = michael
mitch    = mitchell
nate     = nathaniel
nathan   = nathaniel
nick     = nicholas
pat      = patrick
patty    = patrick
pete     = peter
ray      = raymond
rich     = richard
rick     = richard
ricky    = richard
rob      = robert
robbie   = robert
ron      = ronald
ronnie   = ronald
sam      = samuel
steve    = steven
terry    = terence
tom      = thomas
tommy    = thomas
tony     = anthony
will     = william
willy    = william`;


chrome.storage.local.get(
    "nicknameMapText",
    result => {

	console.log(result);

        if (!result.nicknameMapText) {

            textarea.value = DEFAULT_MAP;

            chrome.storage.local.set({
                nicknameMapText:
                    DEFAULT_MAP
            });

        } else {

            textarea.value =
                result.nicknameMapText;

        }

    }
);


function saveNicknameMap() {
chrome.storage.local.set({
    nicknameMapText: textarea.value
});

	alert("Saved!");
}

document
    .getElementById("add-nicknames-btn")
    .addEventListener(
        "click",
        saveNicknameMap
    );

document
    .getElementById("back-btn")
    .addEventListener(
        "click",
        () => {
            window.location.href =
                "popup.html";
        }
    );
// Apply WebRTC policy on startup/install
chrome.runtime.onInstalled.addListener(applyPolicy);
chrome.runtime.onStartup.addListener(applyPolicy);

function applyPolicy() {
  chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: 'disable_non_proxied_udp'
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Setting failed:', chrome.runtime.lastError);
    } else {
      console.log('WebRTC policy applied: disable_non_proxied_udp');
    }
  });
}

// EMERGENCY STOP - Remove all redirect rules
chrome.runtime.onInstalled.addListener(() => {
    killAllRedirects();
});

// Kill redirects on startup too
killAllRedirects();

function killAllRedirects() {
    // Remove ALL rules
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const ruleIds = rules.map(rule => rule.id);
        if (ruleIds.length > 0) {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: ruleIds
            });
            console.log('Killed redirect rules:', ruleIds);
        }
    });
    
    // Also try to remove any possible rule IDs
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1, 2, 3, 4, 5, 10, 100, 1000, 10000]
    });
}

// Do nothing else - just sit there and prevent redirects
console.log("Redirect killer active - no more loops!");
// Check Chrome version on install
chrome.runtime.onInstalled.addListener(() => {
  checkChromeVersion();
  logInstalledExtensions();
});

function checkChromeVersion() {
  const userAgent = navigator.userAgent || '';
  const chromeVersion = getChromeVersion(userAgent);
  const requiredVersion = 95;

  if (chromeVersion < requiredVersion) {
    notifyUser(chromeVersion);
  }
}

function getChromeVersion(userAgent) {
  const match = userAgent.match(/Chrome\/([0-9]+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function notifyUser(version) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "a1/outdatedchrome.png",
    title: "Update Chrome",
    message: `You're using Chrome version ${version}. A newer version is available. Please update to the latest version for security updates!`,
    priority: 2
  });
}

function logInstalledExtensions() {
  console.log("__________________________________________________________");
  chrome.management.getAll((extensions) => {
    if (extensions && Array.isArray(extensions)) {
      console.log("Loaded extensions:", extensions);
    } else {
      console.log("No extensions found or error loading extensions");
    }
    console.log("__________________________________________________________");  
  });
}

// Malicious extension detection
const knownMaliciousExtensions = [
  "chmfnmjfghjpdamlofhlonnnnokkpbao",
  "ohcpnigalekghcmgcdcenkpelffpdolg", 
  "lgjdgmdbfhobkdbcjnpnlmhnplnidkkp",
"lklmhefoneonjalpjcnhaidnodopinib",
"ciifcakemmcbbdpmljdohdmbodagmela",
"meljmedplehjlnnaempfdoecookjenph",
"lipmdblppejomolopniipdjlpfjcojob",
"lmcboojgmmaafdmgacncdpjnpnnhpmei",
"icnekagcncdgpdnpoecofjinkplbnocm",
"bahogceckgcanpcoabcdgmoidngedmfo",
"bkpdalonclochcahhipekbnedhklcdnp",
"magnkhldhhgdlhikeighmhlhonpmlolk",
"edadmcnnkkkgmofibeehgaffppadbnbi",
"fnppgehoebbgekbnblenoemdeplkhdbi",
"kldhphjgjmimpghmpjclbflnjcedkkpo",
"jeafcbgcfpijmojcfbpfakeebmpheodk",
"nkfhmlmkagghjekpgepdokjialhkpbco",
"doaednhagbbpmldpjleemcaifcdmhebd",
"hchahigddjfnomcffodpdldcelbdokca",
"mciopmnnihmgfdifdbnfleigcfdmhhld",
"lplikpbccpnpengjhlbanpingconidnb",
"cjlhobnbcccholccmbmldkmljpcomeed",
"papfdhpcfmiblmeakfdolodaekchkhml",
"ljogikabgneongglndeaeillgdlonbdl",
"bfkddaggabgkfkmgglhobiipoapmkekk",
"icdbahmpfjhbccfjhhbckaapbbjggogp",
"phneobmajjlpompaibdmlnkdedmeldfi",
"bbjlfgjdfapkcpnamjbplldickhmgjcc",
"aanhphdacjffgjchacninjllcanobflj",
"agdbjdlloeeajmnlgnbmdhenhmgdnpni",
"glgodjhenlcmiejebcbcgjalcjmifceo",
"emedckhdnioeieppmeojgegjfkhdlaeo",
"eaijffijbobmnonfhilihbejadplhddo",
"lbneaaedflankmgmfbmaplggbmjjmbae",
"hmiaoahjllhfgebflooeeefeiafpkfde",
"pdkmmfdfggfpibdjbbghggcllhhainjo",
"jiofmdifioeejeilfkpegipdjiopiekl",
"acmfnomgphggonodopogfbmkneepfgnh",
"bibjgkidgpfbblifamdlkdlhgihmfohh",
"pkgciiiancapdlpcbppfkmeaieppikkk",
"epdjhgbipjpbbhoccdeipghoihibnfja",
"bbdnohkpnbkdkmnkddobeafboooinpla",
"befflofjcniongenjmbkgkoljhgliihe",
"cedgndijpacnfbdggppddacngjfdkaca",
"nnpnnpemnckcfdebeekibpiijlicmpom",
"cplhlgabfijoiabgkigdafklbhhdkahj",
"egmennebgadmncfjafcemlecimkepcle",
"mnhffkhmpnefgklngfmlndmkimimbphc",
"oaikpkmjciadfpddlpjjdapglcihgdle",
"fbmlcbhdmilaggedifpihjgkkmdgeljh",
"oeiomhmbaapihbilkfkhmlajkeegnjhe",
"igbodamhgjohafcenbcljfegbipdfjpk",
"bgejafhieobnfpjlpcjjggoboebonfcg",
"llimhhconnjiflfimocjggfjdlmlhblm",
"epikoohpebngmakjinphfiagogjcnddm",
"pajkjnmeojmbapicmbpliphjmcekeaac",
"ogbhbgkiojdollpjbhbamafmedkeockb",
"eanofdhdfbcalhflpbdipkjjkoimeeod",
"ekpkdmohpdnebfedjjfklhpefgpgaaji",
"miglaibdlgminlepgeifekifakochlka",
"mbindhfolmpijhodmgkloeeppmkhpmhc",
"didhgeamncokiaegffipckhhcpnmlcbl",
"ndlbedplllcgconngcnfmkadhokfaaln",
"lgjdgmdbfhobkdbcjnpnlmhnplnidkkp",
"chmfnmjfghjpdamlofhlonnnnokkpbao",
"lklmhefoneonjalpjcnhaidnodopinib",
"ciifcakemmcbbdpmljdohdmbodagmela",
"lipmdblppejomolopniipdjlpfjcojob",
"lmcboojgmmaafdmgacncdpjnpnnhpmei",
"icnekagcncdgpdnpoecofjinkplbnocm",
"bahogceckgcanpcoabcdgmoidngedmfo",
"magnkhldhhgdlhikeighmhlhonpmlolk",
"edadmcnnkkkgmofibeehgaffppadbnbi",
"ajneghihjbebmnljfhlpdmjjpifeaokc",
"nadenkhojomjfdcppbhhncbfakfjiabp",
"pbdpfhmbdldfoioggnphkiocpidecmbp",
"hdgdghnfcappcodemanhafioghjhlbpb",
"fbjfihoienmhbjflbobnmimfijpngkpa",
"kjeffohcijbnlkgoaibmdcfconakaajm",
"djmpbcihmblfdlkcfncodakgopmpgpgh",
"obeokabcpoilgegepbhlcleanmpgkhcp",
"mcmdolplhpeopapnlpbjceoofpgmkahc",
"dppnhoaonckcimpejpjodcdoenfjleme",
"idgncaddojiejegdmkofblgplkgmeipk",
"deebfeldnfhemlnidojiiidadkgnglpi",
"gfbgiekofllpkpaoadjhbbfnljbcimoh",
"pbebadpeajadcmaoofljnnfgofehnpeo",
"flmihfcdcgigpfcfjpdcniidbfnffdcf",
"pinnfpbpjancnbidnnhpemakncopaega",
"iicpikopjmmincpjkckdngpkmlcchold",
"bjlcpoknpgaoaollojjdnbdojdclidkh",
"okclicinnbnfkgchommiamjnkjcibfid",
"pcjmcnhpobkjnhajhhleejfmpeoahclc",
"hinhmojdkodmficpockledafoeodokmc",
"gcnceeflimggoamelclcbhcdggcmnglm",
"kacljcbejojnapnmiifgckbafkojcncf",
"jhkhlgaomejplkanglolfpcmfknnomle",
"nkmooloiipfcknccapehflmampkaniji",
"kgddnoifhgfdhcpbkkjdgokfnkkmdcen",
"gbdjcgalliefpinpmggefbloehmmknca",
"eggeoellnjnnglaibpcmggjnjifeebpi",
"ionpbgeeliajehajombdeflogfpgmmel",
"jaekigmcljkkalnicnjoafgfjoefkpeg",
"aeilijiaejfdnbagnpannhdoaljpkbhe",
"afdfpkhbdpioonfeknablodaejkklbdn",
"anflghppebdhjipndogapfagemgnlblh",
"bnpkdbbfehooennlcojneoimfjgekdgn",
"ccdcekhamjgodmpfeahkdmjaacjimaik",
"kjnfcbllkabobhecjmlabebihkgbhffn",
"odfgfdbaggdadllmpifidicdehiifgpf",
"fgiaibpabhdkjenjhgpmgcieobcjaonj",
"elpifopaokfnkkinlllbdpdinpknllpi",
"paepjkdcdabdjbbojlecgocaolnmejek",
"phkepkiakkabihlelfogihcgajnofmij",
"epjgmeifamplggbbhafceafeigdbilib",
"obfcgcbmoigeopimfllpnlglccbkjoco",
"ickgkkkoddllgfhokebeeannoljdfphi",
"ekoheeklkmlfkedaoocmgofphmekjehp",
"jbdlcghcledhmmgdjlnoeapmmpkdgdke",
"mgpfnmhopighiffejjphedekolfopkcc",
"dfkoailcbbbgpplbcajcfodmdlkcgonn",
"ohipjedcccbnmbmnadcgpakeebpcdpgb",
"kldhphjgjmimpghmpjclbflnjcedkkpo",
"fnmihdojmnkclgjpcoonokmkhjpjechg",
"doaednhagbbpmldpjleemcaifcdmhebd",
"ljogikabgneongglndeaeillgdlonbdl",
"jeafcbgcfpijmojcfbpfakeebmpheodk",
"dbolleecibjnchhpdbpgpdfmeapnddii",
"cmbemilpkgkhmnjbdcpgdkcehflmgfba",
"aanhphdacjffgjchacninjllcanobflj",
"phneobmajjlpompaibdmlnkdedmeldfi",
"ifaecdmigambikgfpmogjciecmpedbgg",
"glgodjhenlcmiejebcbcgjalcjmifceo",
"iedgaahefhnapfkjdkaopmbnenkiofma",
"nbaffmdpjbdmdllljaefebijkplldmbc",
"bbjlfgjdfapkcpnamjbplldickhmgjcc",
"ffhnbghkhgfggglngiakbabfcppjicci",
"ljogikabgneongglndeaeillgdlonbdl",
"acdfdofofabmipgcolilkfhnpoclgpdd",
"oobppndjaabcidladjeehddkgkccfcpn",
"aonedlchkbicmhepimiahfalheedjgbh",
"aoeacblfmdamdejeiaepojbhohhkmkjh",
"miejmllodobdobgjbeonandkjhnhpjbn",
"fmfjhicbjecfchfmpelfnifijeigelme",
"aemaecahdckfllfldhgimjhdgiaahean",
"lgjogljbnbfjcaigalbhiagkboajmkkj",
"akdbogfpgohikflhccclloneidjkogog",
"jhcfnojahmdghhebdaoijngclknfkbjn",
"nfbacikojbiejmiioolkbolofiegidda",
"fcfdegencfkkpphgkogonmpckeofhgko",
"pobknfocgoijjmokmhimkfhemcnigdji ",
"iclckldkfemlnecocpphinnplnmijkol ",
"jmpcodajbcpgkebjipbmjdoboehfiddd ",
"ihdnbohcfnegemgomjcpckmpnkdgopon ",
"cedgndijpacnfbdggppddacngjfdkaca ",
"bbdnohkpnbkdkmnkddobeafboooinpla ",
"egmennebgadmncfjafcemlecimkepcle ",
"ccollcihnnpcbjcgcjfmabegkpbehnip",
"aeibljandkelbcaaemkdnbaacppjdmom",
"fcfmhlijjmckglejcgdclfneafoehafm",
"abbngaojehjekanfdipifimgmppiojpl",
"dohmiglipinohflhapdagfgbldhmoojl",
"acmiibcdcmaghndcahglamnhnlmcmlng",
"mipophmjfhpecleajkijfifmffcjdiac",
"cknmibbkfbephciofemdjndbgebggnkc",
"gmigkpkjegnpmjpmnmgnkhmoinpgdnfc",
"ahgccenjociolkbpgbfibmfclcfnlaei",
"kjhjnbdjonamibpaalanflmidplhiehe",
"nejfdccopmpimplhmmdfjobodgeaoihd",
"dhhmopcmpiadcgchhhldcpoeppcofdic",
"ffmfnniephcagojkpjddjiogjeoijjgl",
"nabbdpjneieneepdfnmkdhooellilgho",
"mldeggofnfaiinachdeidpecmflffoam",
"bhahpmoebdipfoaadcclkcnieeokebnf",
"oliiideaalkijolilhhaibhbjfhbdcnm",
"aofddmgnidinflambjlfkpboeamdldbd",
"oeefjlikahigmlnplgijgeeecbpemhip",
"ohhhngpnknpdhmdmpmoccgjmmkkleipn",
"odhmhkkhpibfjijmpgcdjondompgocog",

].filter(Boolean); // Remove any empty/undefined entries

const fakeSecurityExtensions = [
  "gjfpmkejnolcfklaaddjnckanhhgegla"
].filter(Boolean);

// Consolidated extension checking
function checkExtensions() {
  chrome.management.getAll((extensions) => {
    if (!extensions || !Array.isArray(extensions)) return;
    
    extensions.forEach((ext) => {
      if (!ext || !ext.id) return;
      
      if (knownMaliciousExtensions.includes(ext.id)) {
        disableExtension(ext, "Malicious Extension Blocked", `Disabled: ${ext.name || 'ExtensionNameDidntLoad'}`);
      } else if (fakeSecurityExtensions.includes(ext.id)) {
        disableExtension(ext, 
          "ALERT: Fake Security Extension Blocked", 
          `We've blocked a fake "security" extension: ${ext.name || 'unknown extension'}`);
      }
    });
  });
}

function disableExtension(ext, title, message) {
  if (!ext || !ext.id) return;
  
  chrome.management.setEnabled(ext.id, false, () => {
    console.log(`Disabled extension: ${ext.name || ext.id}`);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "ExtensionBlocked.png",
      title: title,
      message: message,
      priority: 2
    });
  });
}

// Google Docs warning system
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo || !tab || !tab.url) return;
  
  if (changeInfo.status === "complete" && typeof tab.url === 'string' && tab.url.includes("docs.google.com/document/")) {
    console.log('Public Google Doc detected! Sending warning...');
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        try {
          chrome.runtime.sendMessage({ action: "showWarningPopup" });
        } catch (e) {
          console.error('Error sending message:', e);
        }
      }
    });
  }
});

// Dangerous download blocker - completely safe version
chrome.downloads.onCreated.addListener((downloadItem) => {
  if (!downloadItem || typeof downloadItem !== 'object') return;

  const dangerLevel = (downloadItem.dangerLevel || '').toString().toUpperCase();
  const filename = downloadItem.filename || 'unknown file';
  const id = downloadItem.id;

  const DANGER_TYPES = new Set([
    'DANGEROUS',
    'DANGEROUS_ACCOUNT_COMPROMISE',
    'DANGEROUS_HOST'
  ]);

  if (DANGER_TYPES.has(dangerLevel)) {
    try {
      chrome.downloads.cancel(id, () => {
        if (chrome.runtime.lastError) {
          console.error('Cancel failed:', chrome.runtime.lastError.message);
          return;
        }
        
        console.log(`Blocked dangerous download: ${filename}`);
        
        chrome.notifications.create({
          type: "basic",
          iconUrl: "a1/downloadblocked",
          title: "Download Blocked",
          message: `Blocked potentially dangerous file: ${filename}`,
          priority: 2
        });
      });
    } catch (e) {
      console.error('Download blocking failed:', e);
    }
  }
});

// Initialize
console.log("~_-resafe loaded-_~");
chrome.runtime.onStartup.addListener(() => {
  try {
    checkExtensions();
  } catch (e) {
    console.error('Startup error:', e);
  }
});
chrome.runtime.onInstalled.addListener(() => {
  try {
    checkExtensions();
  } catch (e) {
    console.error('Install error:', e);
  }
});

// permission

let cameraEnabled = true;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'toggleCamera') {
    cameraEnabled = !cameraEnabled;
    chrome.contentSettings.camera.set({
      primaryPattern: '<all_urls>',
      setting: cameraEnabled ? 'allow' : 'block'
    }, () => {
      sendResponse({ enabled: cameraEnabled });
    });
    return true; // keep sendResponse alive
  }
});
let micEnabled = true;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'toggleMic') {
    micEnabled = !micEnabled;
    chrome.contentSettings.microphone.set({
      primaryPattern: '<all_urls>',
      setting: micEnabled ? 'allow' : 'block'
    }, () => {
      sendResponse({ enabled: micEnabled });
    });
    return true; // keep sendResponse alive for async
  }
});

package com.nithamorukural.habitapp

import android.Manifest
import android.app.TimePickerDialog
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.BackHandler
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.time.LocalDateTime

private val Emerald = Color(0xFF047857)
private val Slate = Color(0xFF0F172A)
private val Background = Color(0xFFF6F8F7)
private val colors = lightColorScheme(primary = Emerald, secondary = Color(0xFF52665B), background = Background,
    surface = Color.White, surfaceVariant = Color(0xFFEAF0EC), onSurface = Slate, onBackground = Slate,
    secondaryContainer=Color(0xFFE1F2E9),onSecondaryContainer=Emerald,
    primaryContainer=Color(0xFFE1F2E9),onPrimaryContainer=Emerald,onSurfaceVariant=Color(0xFF52605B))

class MainActivity : ComponentActivity() {
    private var migrated by mutableStateOf(false)
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(SystemBarStyle.light(0xFFF6F8F7.toInt(),0xFFF6F8F7.toInt()), SystemBarStyle.light(0xFFFFFFFF.toInt(),0xFFFFFFFF.toInt()))
        setContent {
            MaterialTheme(colorScheme = colors) {
                if (migrated) NativeKuralApp() else Box(Modifier.fillMaxSize().background(Background).safeDrawingPadding(), contentAlignment=Alignment.Center) {
                    Column(horizontalAlignment=Alignment.CenterHorizontally, verticalArrangement=Arrangement.spacedBy(16.dp)) {
                        CircularProgressIndicator(); Text("நித்தம் ஒரு குறள்", style=MaterialTheme.typography.titleLarge)
                        Text("Preparing your reading library…")
                    }
                }
            }
        }
        LegacyMigration.run(this) {
            migrated = true
            if(getSharedPreferences("native_habit",0).getString("legacy_status","")=="retry_needed")
                android.widget.Toast.makeText(this,"Old saved data could not be imported yet. Please close and reopen the app to retry. Do not uninstall.",android.widget.Toast.LENGTH_LONG).show()
        }
    }
}
private fun label(language: String, tamil: String, english: String) = if (language == "tamil") tamil else english

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NativeKuralApp() {
    val context = LocalContext.current
    val application = context.applicationContext as android.app.Application
    val factory = remember(application) { androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory(application) }
    val vm: KuralViewModel = viewModel(factory=factory)
    val prefs by vm.preferences.collectAsStateWithLifecycle()
    val library by vm.library.collectAsStateWithLifecycle()
    val now by vm.now.collectAsStateWithLifecycle()
    val error by vm.error.collectAsStateWithLifecycle()
    val owner = LocalLifecycleOwner.current
    val snackbar = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    val speech = remember { OfflineSpeech(context) }
    DisposableEffect(speech) { onDispose { speech.close() } }
    DisposableEffect(owner) {
        val listener = LifecycleEventObserver { _, event -> if (event == Lifecycle.Event.ON_RESUME) vm.onResume() else if (event == Lifecycle.Event.ON_PAUSE) speech.stop() }
        owner.lifecycle.addObserver(listener)
        onDispose { owner.lifecycle.removeObserver(listener) }
    }
    var tab by rememberSaveable { mutableStateOf("today") }
    var sharing by remember { mutableStateOf<Kural?>(null) }
    var privacy by rememberSaveable { mutableStateOf(false) }
    var jump by rememberSaveable { mutableStateOf(false) }
    LaunchedEffect(prefs.advanced) { if (!prefs.advanced && tab == "library") tab = "today" }
    BackHandler(tab != "today" && !privacy && sharing == null && !jump) { tab = "today" }
    val nav = buildList {
        add(Triple("today", label(prefs.language,"இன்று","Today"), Icons.Default.Home))
        if (prefs.advanced) add(Triple("library",label(prefs.language,"தொகுப்பு","Library"),Icons.AutoMirrored.Filled.List))
        add(Triple("saved",label(prefs.language,"சேமிப்பு","Saved"),Icons.Default.Favorite))
        add(Triple("settings",label(prefs.language,"அமைப்பு","Settings"),Icons.Default.Settings))
    }
    Scaffold(
        modifier = Modifier.fillMaxSize(), containerColor = Background,
        contentWindowInsets = WindowInsets.safeDrawing,
        topBar = {
            TopAppBar(expandedHeight=(72*LocalDensity.current.fontScale).dp, title = { Column {
                Text("நித்தம் ஒரு குறள்", style=MaterialTheme.typography.titleLarge, fontWeight=FontWeight.Bold)
                Text("SMARTIVA  ·  DAILY WISDOM", style=MaterialTheme.typography.labelSmall, color=Emerald)
            } }, colors=TopAppBarDefaults.topAppBarColors(containerColor=Background),
                windowInsets=WindowInsets.statusBars.union(WindowInsets.displayCutout))
        },
        bottomBar = {
            NavigationBar(containerColor=Color.White, windowInsets=WindowInsets.navigationBars.union(WindowInsets.displayCutout)) {
                nav.forEach { (id,title,icon) -> NavigationBarItem(selected=tab==id,onClick={ tab=id; speech.stop() }, icon={ Icon(icon,contentDescription=null) },label={ Text(title,style=MaterialTheme.typography.labelSmall) }) }
            }
        },
        snackbarHost = { SnackbarHost(snackbar) }
    ) { padding ->
        Box(Modifier.fillMaxSize().padding(padding).consumeWindowInsets(padding).imePadding()) {
            val data = library
            if (data == null) {
                Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center) { if (error == null) CircularProgressIndicator() else Text(error!!, Modifier.padding(24.dp)) }
            } else {
                val date = cycleDate(prefs.schedule, now)
                val daily = dailyKural(data,prefs,date)
                val open: (Kural) -> Unit = { vm.open(it.number); tab="today" }
                when(tab) {
                    "today" -> TodayScreen(data,prefs,daily,date.toString(),streak(prefs.dates,date),vm,
                        onShare={ sharing=it }, onJump={ jump=true }, onSpeak={
                            if (!speech.speak(daily,prefs.language)) scope.launch { snackbar.showSnackbar(label(prefs.language,"இந்த மொழிக்கு offline voice இல்லை. Android அமைப்பில் voice pack நிறுவுங்கள்.","No offline voice for this language. Install a local voice pack in Android settings.")) }
                        })
                    "library" -> LibraryScreen(data,prefs,open,{ vm.favorite(it) },{ sharing=it })
                    "saved" -> SavedScreen(data,prefs,open,{ vm.favorite(it) },{ sharing=it })
                    "settings" -> SettingsScreen(data,prefs,vm,{ privacy=true }) { message -> scope.launch { snackbar.showSnackbar(message) } }
                }
            }
        }
    }
    if (jump) JumpDialog(prefs.language,onDismiss={jump=false}) { number -> vm.open(number); tab="today"; jump=false }
    if (privacy) PrivacyDialog { privacy=false }
    sharing?.let { kural ->
        ModalBottomSheet(onDismissRequest={sharing=null}, containerColor=Color.White) {
            Column(Modifier.fillMaxWidth().padding(horizontal=24.dp).padding(bottom=32.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
                Text(label(prefs.language,"குறள் #${kural.number} பகிர்","Share Kural #${kural.number}"), style=MaterialTheme.typography.titleLarge)
                Button(onClick={ runCatching { shareText(context,kuralShareText(kural,prefs.language)) }.onFailure { scope.launch { snackbar.showSnackbar("No app is available for sharing.") } }; sharing=null },Modifier.fillMaxWidth()) { Icon(Icons.Default.Share,null); Spacer(Modifier.width(8.dp)); Text(label(prefs.language,"உரையாகப் பகிர்","Share text")) }
                OutlinedButton(onClick={ scope.launch {
                    runCatching {
                        val uri=withContext(Dispatchers.IO){preparePoster(context,kural,prefs.language)}
                        sharePoster(context,uri)
                    }.onFailure { snackbar.showSnackbar("Image sharing could not finish. Please try sharing text.") }
                    sharing=null
                } },Modifier.fillMaxWidth()) { Text(label(prefs.language,"படமாகப் பகிர்","Share image")) }
                Text(label(prefs.language,"உங்கள் தனிப்பட்ட குறிப்புகள் இதில் சேர்க்கப்படாது.","Your private reflection notes are not included."),style=MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun LanguagePicker(prefs: Preferences, vm: KuralViewModel) {
    val choices=listOf("tamil" to "தமிழ்","tanglish" to "Tanglish","english" to "English")
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        if(maxWidth<300.dp || LocalDensity.current.fontScale>=1.2f) {
            var expanded by remember { mutableStateOf(false) }
            Box(Modifier.fillMaxWidth()) {
                OutlinedButton(onClick={expanded=true},modifier=Modifier.fillMaxWidth(),contentPadding=PaddingValues(12.dp)) {
                    Text(label(prefs.language,"மொழி: ","Language: ")+choices.first{it.first==prefs.language}.second,Modifier.weight(1f))
                    Icon(Icons.Default.ArrowDropDown,null)
                }
                DropdownMenu(expanded,onDismissRequest={expanded=false}) {
                    choices.forEach { (id,text) -> DropdownMenuItem(text={Text(text)},onClick={vm.update{it.copy(language=id)};expanded=false}) }
                }
            }
        } else {
            Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(6.dp)) {
                choices.forEach { (id,text) ->
                    FilterChip(selected=prefs.language==id,onClick={vm.update { it.copy(language=id) }},label={Text(text)},modifier=Modifier.weight(1f))
                }
            }
        }
    }
}
@Composable
private fun StreakBadge(lang:String,count:Int) {
    Surface(color=Color(0xFFE1F2E9),shape=MaterialTheme.shapes.large) {
        Text(label(lang,"$count நாள் தொடர்","$count day streak"),Modifier.padding(horizontal=12.dp,vertical=8.dp),color=Emerald,style=MaterialTheme.typography.labelMedium)
    }
}
@Composable
private fun ReadingHeading(lang:String,date:String,count:Int) {
    BoxWithConstraints(Modifier.fillMaxWidth()) {
        if(maxWidth<300.dp || LocalDensity.current.fontScale>=1.2f) {
            Column(verticalArrangement=Arrangement.spacedBy(8.dp)) {
                Text(label(lang,"இன்றைய வாசிப்பு","Your daily reading"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                Text(date,style=MaterialTheme.typography.bodySmall,color=MaterialTheme.colorScheme.onSurfaceVariant)
                StreakBadge(lang,count)
            }
        } else {
            Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.SpaceBetween,verticalAlignment=Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(label(lang,"இன்றைய வாசிப்பு","Your daily reading"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                    Text(date,style=MaterialTheme.typography.bodySmall,color=MaterialTheme.colorScheme.onSurfaceVariant)
                }
                StreakBadge(lang,count)
            }
        }
    }
}

@Composable
private fun TodayScreen(data: Library, prefs: Preferences, kural: Kural, date: String, streak: Int, vm: KuralViewModel,
    onShare: (Kural)->Unit, onJump: ()->Unit, onSpeak: ()->Unit) {
    val lang=prefs.language
    val content=kural.readings.getValue(lang)
    val done=date in prefs.dates
    var application by rememberSaveable { mutableStateOf(0) }
    LazyColumn(Modifier.fillMaxSize(),contentPadding=PaddingValues(start=16.dp,end=16.dp,top=8.dp,bottom=24.dp),verticalArrangement=Arrangement.spacedBy(16.dp)) {
        item { LanguagePicker(prefs,vm) }
        item { ReadingHeading(lang,date,streak) }
        item {
            Card(colors=CardDefaults.cardColors(containerColor=Slate,contentColor=Color.White),shape=MaterialTheme.shapes.extraLarge) {
                Column(Modifier.fillMaxWidth().padding(22.dp),verticalArrangement=Arrangement.spacedBy(18.dp)) {
                    Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically) {
                        Text("குறள் #${kural.number}",color=Color(0xFF6EE7B7),style=MaterialTheme.typography.titleMedium,modifier=Modifier.weight(1f))
                        IconButton(onClick={vm.favorite(kural.number)}) { Icon(if(kural.number in prefs.favorites) Icons.Default.Favorite else Icons.Default.FavoriteBorder,contentDescription=label(lang,"பிடித்தவை","Favorite"),tint=if(kural.number in prefs.favorites) Color(0xFFFDA4AF) else Color.White) }
                    }
                    Text(kural.chapterNames[lang].orEmpty(),style=MaterialTheme.typography.bodySmall,color=Color(0xFFCBD5E1))
                    SelectionContainer { Text("${kural.line1}\n${kural.line2}",fontSize=25.sp,lineHeight=40.sp,fontWeight=FontWeight.SemiBold) }
                    if(lang!="tamil") Text(if(lang=="english") kural.translation else kural.phonetic,style=MaterialTheme.typography.bodyMedium,color=Color(0xFFCBD5E1),lineHeight=25.sp)
                    HorizontalDivider(color=Color(0xFF334155))
                    Button(onClick={vm.complete(kural.number)},modifier=Modifier.fillMaxWidth(),enabled=!done,
                        colors=ButtonDefaults.buttonColors(containerColor=Color(0xFF6EE7B7),contentColor=Slate,disabledContainerColor=Color(0xFF1E443D),disabledContentColor=Color(0xFF6EE7B7)),contentPadding=PaddingValues(14.dp)) {
                        Icon(Icons.Default.Check,null); Spacer(Modifier.width(8.dp)); Text(label(lang,if(done)"இன்று படித்து முடித்தேன்" else "படித்து முடித்தேன்",if(done)"Completed today" else "Mark as read"),modifier=Modifier.weight(1f))
                    }
                    Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick=onSpeak,modifier=Modifier.weight(1f),colors=ButtonDefaults.outlinedButtonColors(contentColor=Color.White)) { Text(label(lang,"கேட்க","Listen")) }
                        OutlinedButton(onClick={onShare(kural)},modifier=Modifier.weight(1f),colors=ButtonDefaults.outlinedButtonColors(contentColor=Color.White)) { Text(label(lang,"பகிர்","Share")) }
                    }
                }
            }
        }
        item {
            Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(8.dp)) {
                if(prefs.advanced) IconButton(onClick={vm.open(if(kural.number==1)1330 else kural.number-1)}) { Icon(Icons.AutoMirrored.Filled.ArrowBack,label(lang,"முந்தைய குறள்","Previous Kural")) }
                OutlinedButton(onClick={ if(prefs.advanced)onJump() else {
                    val pool=data.kurals.filter{it.topic in prefs.topics}; val index=pool.indexOfFirst{it.number==kural.number}; vm.open(pool[(index+1).mod(pool.size)].number)
                } },modifier=Modifier.weight(1f)) { Text(label(lang,if(prefs.advanced)"குறள் எண் தேர்வு" else "வேறொரு குறள்",if(prefs.advanced)"Go to Kural" else "Another Kural")) }
                if(prefs.advanced) IconButton(onClick={vm.open(if(kural.number==1330)1 else kural.number+1)}) { Icon(Icons.AutoMirrored.Filled.ArrowForward,label(lang,"அடுத்த குறள்","Next Kural")) }
            }
        }
        item { ReadingCard(label(lang,"தெளிவுரை","Meaning"),content.explanation,content.scholarNote) }
        item { ReadingCard(label(lang,"நடைமுறை உதாரணம்","Everyday example"),content.realWorldExample) }
        item {
            Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
                Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(14.dp)) {
                    Text(label(lang,"இன்று பயன்படுத்துங்கள்","Put it into practice"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                    PrimaryTabRow(selectedTabIndex=application) {
                        listOf(label(lang,"வாழ்க்கை","Life"),label(lang,"தொழில்","Work")).forEachIndexed { i,title -> Tab(selected=application==i,onClick={application=i},text={Text(title)}) }
                    }
                    SelectionContainer { Text(if(application==0)content.lifeApplication else content.businessApplication,style=MaterialTheme.typography.bodyLarge,lineHeight=29.sp) }
                }
            }
        }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFE1F2E9))) {
            Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) {
                Text(label(lang,"இன்றைய சிறு செயல்","One small action"),style=MaterialTheme.typography.labelLarge,color=Emerald)
                Text(content.actionableTakeaway,style=MaterialTheme.typography.bodyLarge,lineHeight=28.sp)
            }
        } }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
            Column(Modifier.fillMaxWidth().padding(18.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
                Text(label(lang,"என் குறிப்பு","My reflection"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                OutlinedTextField(value=prefs.notes[kural.number].orEmpty(),onValueChange={vm.note(kural.number,it)},modifier=Modifier.fillMaxWidth(),minLines=4,
                    placeholder={Text(label(lang,"இந்தக் குறளை இன்று எப்படிப் பயன்படுத்தலாம்?","How can you put this Kural into practice?"))})
                Text(label(lang,"இந்த சாதனத்தில் தானாகச் சேமிக்கப்படும் · தனிப்பட்டது","Saved on this device · Private"),style=MaterialTheme.typography.bodySmall,color=MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } }
    }
}
@Composable
private fun ReadingCard(title: String, text: String, note: String="") {
    Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
        Column(Modifier.fillMaxWidth().padding(18.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
            Text(title,style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
            SelectionContainer { Text(text,style=MaterialTheme.typography.bodyLarge,lineHeight=29.sp) }
            if(note.isNotBlank()) { HorizontalDivider(); Text(note,style=MaterialTheme.typography.bodyMedium,color=MaterialTheme.colorScheme.onSurfaceVariant,lineHeight=25.sp) }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun LibraryScreen(data: Library, prefs: Preferences, onOpen:(Kural)->Unit, onFavorite:(Int)->Unit, onShare:(Kural)->Unit) {
    var query by rememberSaveable { mutableStateOf("") }
    var topic by rememberSaveable { mutableStateOf("all") }
    var chapter by rememberSaveable { mutableIntStateOf(0) }
    var topicMenu by remember { mutableStateOf(false) }
    var chapterMenu by remember { mutableStateOf(false) }
    val results = remember(query,topic,chapter,data) {
        val q=query.trim()
        data.kurals.filter { k ->
            (topic=="all" || topic==k.topic) && (chapter==0 || chapter==k.chapter) &&
                (q.isEmpty() || k.number.toString()==q || listOf(k.line1,k.line2,k.phonetic,k.translation,k.readings.getValue("tamil").explanation,k.readings.getValue("english").explanation).any { it.contains(q,ignoreCase=true) } || k.chapterNames.values.any{it.contains(q,ignoreCase=true)})
        }
    }
    LazyColumn(Modifier.fillMaxSize(),contentPadding=PaddingValues(16.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
        item { Text(label(prefs.language,"1,330 குறள்கள்","The complete collection"),style=MaterialTheme.typography.headlineSmall,fontWeight=FontWeight.Bold) }
        item { OutlinedTextField(query,{query=it},modifier=Modifier.fillMaxWidth(),label={Text(label(prefs.language,"எண், சொல் அல்லது கருத்து","Number, word or meaning"))},leadingIcon={Icon(Icons.Default.Search,null)},singleLine=true) }
        item {
            Column(verticalArrangement=Arrangement.spacedBy(8.dp)) {
                Box {
                    OutlinedButton(onClick={topicMenu=true},modifier=Modifier.fillMaxWidth()) { Text(if(topic=="all")label(prefs.language,"அனைத்து தலைப்புகள்","All topics") else data.topics.first{it.id==topic}.labels[prefs.language].orEmpty()) }
                    DropdownMenu(expanded=topicMenu,onDismissRequest={topicMenu=false},modifier=Modifier.heightIn(max=360.dp)) {
                        DropdownMenuItem(text={Text(label(prefs.language,"அனைத்து தலைப்புகள்","All topics"))},onClick={topic="all";topicMenu=false})
                        data.topics.forEach { t -> DropdownMenuItem(text={Text(t.labels[prefs.language].orEmpty())},onClick={topic=t.id;topicMenu=false}) }
                    }
                }
                Box {
                    OutlinedButton(onClick={chapterMenu=true},modifier=Modifier.fillMaxWidth()) { Text(if(chapter==0)label(prefs.language,"133 அதிகாரங்கள்","All 133 chapters") else data.chapters.first{it.number==chapter}.names[prefs.language].orEmpty()) }
                    DropdownMenu(expanded=chapterMenu,onDismissRequest={chapterMenu=false},modifier=Modifier.heightIn(max=360.dp)) {
                        DropdownMenuItem(text={Text(label(prefs.language,"அனைத்து அதிகாரங்கள்","All chapters"))},onClick={chapter=0;chapterMenu=false})
                        data.chapters.forEach { c -> DropdownMenuItem(text={Text("${c.number}. ${c.names[prefs.language]}")},onClick={chapter=c.number;chapterMenu=false}) }
                    }
                }
                Text(label(prefs.language,"${results.size} குறள்கள்","${results.size} Kurals"),style=MaterialTheme.typography.labelMedium,color=Emerald)
            }
        }
        if(results.isEmpty())item { EmptyMessage(label(prefs.language,"பொருத்தமான குறள் இல்லை. வேறு சொல்லைத் தேடுங்கள்.","No matching Kurals. Try another word or filter.")) }
        items(results,key={it.number}) { k -> KuralRow(k,prefs,onOpen,onFavorite,onShare) }
    }
}
@Composable
private fun SavedScreen(data: Library, prefs: Preferences, onOpen:(Kural)->Unit, onFavorite:(Int)->Unit, onShare:(Kural)->Unit) {
    var section by rememberSaveable { mutableIntStateOf(0) }
    val list = remember(section,prefs,data) { data.kurals.filter { when(section) { 0 -> it.number in prefs.favorites; 1 -> it.number in prefs.completed; else -> !prefs.notes[it.number].isNullOrBlank() } } }
    LazyColumn(Modifier.fillMaxSize(),contentPadding=PaddingValues(16.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
        item { Text(label(prefs.language,"என் வாசிப்புகள்","Your reading space"),style=MaterialTheme.typography.headlineSmall,fontWeight=FontWeight.Bold) }
        item { PrimaryTabRow(selectedTabIndex=section) {
            listOf(label(prefs.language,"பிடித்தவை","Favorites"),label(prefs.language,"படித்தவை","Read"),label(prefs.language,"குறிப்புகள்","Notes")).forEachIndexed { index,title -> Tab(section==index,{section=index},text={Text(title,style=MaterialTheme.typography.labelMedium)}) }
        } }
        if(list.isEmpty())item { EmptyMessage(label(prefs.language,"இங்கே இன்னும் எதுவும் இல்லை. இன்றைய குறளிலிருந்து தொடங்குங்கள்.","Nothing here yet. Start with your daily Kural.")) }
        items(list,key={it.number}) { k -> KuralRow(k,prefs,onOpen,onFavorite,onShare,if(section==2)prefs.notes[k.number] else null) }
    }
}
@Composable
private fun KuralRow(k: Kural, prefs: Preferences, onOpen:(Kural)->Unit, onFavorite:(Int)->Unit, onShare:(Kural)->Unit, note:String?=null) {
    Card(onClick={onOpen(k)},modifier=Modifier.fillMaxWidth(),colors=CardDefaults.cardColors(containerColor=Color.White)) {
        Column(Modifier.padding(16.dp),verticalArrangement=Arrangement.spacedBy(10.dp)) {
            Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically) {
                Text("குறள் #${k.number}",color=Emerald,fontWeight=FontWeight.SemiBold,modifier=Modifier.weight(1f))
                IconButton(onClick={onFavorite(k.number)}) { Icon(if(k.number in prefs.favorites)Icons.Default.Favorite else Icons.Default.FavoriteBorder,label(prefs.language,"பிடித்தவை","Favorite"),tint=if(k.number in prefs.favorites)Color(0xFFBE3455) else Color(0xFF64748B)) }
                IconButton(onClick={onShare(k)}) { Icon(Icons.Default.Share,label(prefs.language,"பகிர்","Share")) }
            }
            Text("${k.line1}\n${k.line2}",style=MaterialTheme.typography.bodyLarge,lineHeight=28.sp,fontWeight=FontWeight.Medium)
            Text(k.chapterNames[prefs.language].orEmpty(),style=MaterialTheme.typography.bodySmall,color=MaterialTheme.colorScheme.onSurfaceVariant)
            Text(note ?: k.readings.getValue(prefs.language).explanation,style=MaterialTheme.typography.bodyMedium,lineHeight=25.sp)
        }
    }
}
@Composable
private fun EmptyMessage(text:String) { Text(text,Modifier.fillMaxWidth().padding(vertical=24.dp),color=MaterialTheme.colorScheme.onSurfaceVariant,lineHeight=26.sp) }

@Composable
private fun SettingsScreen(data:Library,prefs:Preferences,vm:KuralViewModel,onPrivacy:()->Unit,onMessage:(String)->Unit) {
    val context=LocalContext.current
    val permission=rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        vm.setReminder(granted)
        if(!granted)onMessage(label(prefs.language,"நினைவூட்டலுக்கு Android notification permission தேவை.","Enable notification permission in Android settings to receive reminders."))
    }
    LazyColumn(Modifier.fillMaxSize(),contentPadding=PaddingValues(16.dp),verticalArrangement=Arrangement.spacedBy(16.dp)) {
        item { Text(label(prefs.language,"உங்கள் விருப்பங்கள்","Make it yours"),style=MaterialTheme.typography.headlineSmall,fontWeight=FontWeight.Bold) }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
            Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
                Text(label(prefs.language,"வாசிப்பு மொழி","Reading language"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                LanguagePicker(prefs,vm)
                Text(label(prefs.language,"எளிமையான தினசரி வாசிப்பு அல்லது முழுத் தொகுப்பு.","A focused daily reading, or explore the full collection."),style=MaterialTheme.typography.bodyMedium,lineHeight=25.sp)
                Row(verticalAlignment=Alignment.CenterVertically) {
                    Text(label(prefs.language,"முழுத் தொகுப்பு (Advanced)","Advanced mode · Full library"),Modifier.weight(1f),style=MaterialTheme.typography.bodyLarge)
                    Switch(prefs.advanced,{enabled -> vm.update{it.copy(advanced=enabled)}})
                }
            }
        } }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
            Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
                Text(label(prefs.language,"தினசரி நேரம்","Your daily reminder"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                OutlinedButton(onClick={
                    val parts=prefs.schedule.split(":").map{it.toInt()}
                    TimePickerDialog(context,{_,hour,minute -> vm.update{it.copy(schedule=String.format(java.util.Locale.ROOT,"%02d:%02d",hour,minute),customNumber=null,customDate=null)} },parts[0],parts[1],true).show()
                },modifier=Modifier.fillMaxWidth()) { Text(prefs.schedule,fontSize=24.sp) }
                Row(verticalAlignment=Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(label(prefs.language,"நினைவூட்டல்","Daily notification"),style=MaterialTheme.typography.bodyLarge)
                        Text(label(prefs.language,"App மூடியிருந்தாலும் வரும்","Works when the app is closed"),style=MaterialTheme.typography.bodySmall,color=MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Switch(checked=prefs.reminder && ReminderScheduler.permitted(context),onCheckedChange={ enabled ->
                        if(enabled && Build.VERSION.SDK_INT>=33 && !ReminderScheduler.permitted(context))permission.launch(Manifest.permission.POST_NOTIFICATIONS)
                        else vm.setReminder(enabled)
                    })
                }
                Text(label(prefs.language,"தேர்ந்த நேரத்தில் புதிய வாசிப்பு நாள் தொடங்கும். Battery அமைப்பால் reminder தாமதமாகலாம்.","A new reading day starts at this time. Battery restrictions may delay reminder delivery."),style=MaterialTheme.typography.bodySmall,lineHeight=23.sp,color=MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
            Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(8.dp)) {
                Text(label(prefs.language,"விருப்பத் தலைப்புகள்","Your interests"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                data.topics.forEach { topic ->
                    Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically) {
                        Checkbox(topic.id in prefs.topics,{ selected ->
                            if(!selected && prefs.topics.size==1)onMessage(label(prefs.language,"குறைந்தது ஒரு தலைப்பைத் தேர்ந்தெடுங்கள்.","Keep at least one topic selected."))
                            else vm.update{it.copy(topics=if(selected)it.topics+topic.id else it.topics-topic.id,customNumber=null,customDate=null)}
                        })
                        Text(topic.labels[prefs.language].orEmpty(),Modifier.weight(1f),style=MaterialTheme.typography.bodyMedium)
                    }
                }
                TextButton(onClick={vm.update{it.copy(topics=validTopics,customNumber=null,customDate=null)}}) { Text(label(prefs.language,"அனைத்தையும் தேர்வு செய்","Select all topics")) }
            }
        } }
        item { Card(colors=CardDefaults.cardColors(containerColor=Color.White)) {
            Column(Modifier.padding(18.dp),verticalArrangement=Arrangement.spacedBy(12.dp)) {
                Text(label(prefs.language,"தனியுரிமை & உதவி","Privacy & support"),style=MaterialTheme.typography.titleMedium,fontWeight=FontWeight.SemiBold)
                Text(label(prefs.language,"1,330 குறள்களும் offline-ல் உள்ளன. உங்கள் குறிப்புகள் இந்த சாதனத்தில் மட்டுமே சேமிக்கப்படும். App data அழித்தால் அல்லது uninstall செய்தால் குறிப்புகள் நீங்கும்.","All 1,330 Kurals work offline. Notes and favorites stay on this device. Clearing app data or uninstalling removes them."),style=MaterialTheme.typography.bodyMedium,lineHeight=25.sp)
                Text(label(prefs.language,"நடைமுறை உதாரணங்கள் தலைப்பு சார்ந்த சிந்தனை வழிகாட்டிகள்.","Practical examples are topic-based reflection prompts."),style=MaterialTheme.typography.bodySmall)
                OutlinedButton(onClick=onPrivacy,modifier=Modifier.fillMaxWidth()) { Text(label(prefs.language,"தனியுரிமைக் கொள்கை","Privacy policy")) }
                TextButton(onClick={ runCatching { context.startActivity(Intent(Intent.ACTION_SENDTO,Uri.parse("mailto:info@smartiva.in"))) }.onFailure { onMessage("Contact info@smartiva.in") } }) { Text("info@smartiva.in") }
                Text("Nitham Oru Kural · ${BuildConfig.VERSION_NAME}\nDeveloped by Smartiva\nDeveloper: Nagaraj",style=MaterialTheme.typography.labelSmall,color=MaterialTheme.colorScheme.onSurfaceVariant)
            }
        } }
    }
}
@Composable
private fun JumpDialog(language:String,onDismiss:()->Unit,onPick:(Int)->Unit) {
    var number by rememberSaveable { mutableStateOf("") }
    val valid=number.toIntOrNull()?.takeIf{it in 1..1330}
    AlertDialog(onDismissRequest=onDismiss,title={Text(label(language,"குறள் எண்","Go to Kural"))},
        text={OutlinedTextField(number,{number=it.filter(Char::isDigit).take(4)},label={Text("1 – 1330")},keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Number),isError=number.isNotEmpty()&&valid==null,singleLine=true)},
        confirmButton={TextButton(onClick={valid?.let(onPick)},enabled=valid!=null){Text(label(language,"திற","Open"))}},
        dismissButton={TextButton(onClick=onDismiss){Text(label(language,"ரத்து","Cancel"))}})
}
@Composable
private fun PrivacyDialog(onDismiss:()->Unit) {
    val context=LocalContext.current
    val raw=remember { context.assets.open("privacy-policy.html").bufferedReader().use{it.readText()} }
    val plain=remember(raw) { android.text.Html.fromHtml(raw.substringAfter("<body>"),android.text.Html.FROM_HTML_MODE_COMPACT).toString() }
    AlertDialog(onDismissRequest=onDismiss,title={Text("Privacy policy")},text={SelectionContainer { Text(plain,Modifier.heightIn(max=450.dp).verticalScroll(rememberScrollState()),style=MaterialTheme.typography.bodyMedium,lineHeight=24.sp) }},confirmButton={TextButton(onClick=onDismiss){Text("Close")}})
}

// server.js - Backend for Accessible Chennai Settings
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Translation data for Tamil
const translations = {
    'en': {
        'settingsTitle': 'Settings',
        'voiceAudio': 'Voice & Audio',
        'textToSpeech': 'Text-to-Speech (Voice Guidance)',
        'audioNotifications': 'Audio Notifications',
        'voiceVolume': 'Voice Volume',
        'low': 'Low',
        'high': 'High',
        'visualSettings': 'Visual Settings',
        'fontSize': 'Font Size',
        'highContrast': 'High Contrast Mode',
        'darkMode': 'Dark Mode',
        'reduceMotion': 'Reduce Motion',
        'screenReader': 'Screen Reader',
        'enableScreenReader': 'Enable Screen Reader Optimization',
        'enhancedDescriptions': 'Enhanced Descriptions',
        'navigationHints': 'Navigation Hints',
        'languageRegion': 'Language & Region',
        'preferredLanguage': 'Preferred Language',
        'timeFormat': 'Time Format',
        'hour12': '12-hour',
        'hour24': '24-hour',
        'quickActions': 'Quick Actions',
        'resetSettings': 'Reset Settings',
        'restoreDefaults': 'Restore Defaults',
        'saveChanges': 'Save Changes',
        'settingsSaved': 'Settings saved successfully!'
    },
    'ta': {
        'settingsTitle': 'அமைப்புகள்',
        'voiceAudio': 'குரல் மற்றும் ஒலி',
        'textToSpeech': 'உரை-முதல்-பேச்சு (குரல் வழிகாட்டி)',
        'audioNotifications': 'ஒலி அறிவிப்புகள்',
        'voiceVolume': 'குரல் அளவு',
        'low': 'குறைந்த',
        'high': 'அதிக',
        'visualSettings': 'காட்சி அமைப்புகள்',
        'fontSize': 'எழுத்துரு அளவு',
        'highContrast': 'உயர் தெளிவு முறை',
        'darkMode': 'இருண்ட பயன்முறை',
        'reduceMotion': 'இயக்கம் குறைக்க',
        'screenReader': 'திரை வாசகர்',
        'enableScreenReader': 'திரை வாசகர் மேம்பாட்டை இயக்கவும்',
        'enhancedDescriptions': 'மேம்படுத்தப்பட்ட விளக்கங்கள்',
        'navigationHints': 'வழிசெலுத்தல் குறிப்புகள்',
        'languageRegion': 'மொழி மற்றும் பிராந்தியம்',
        'preferredLanguage': 'விருப்பமான மொழி',
        'timeFormat': 'நேர வடிவம்',
        'hour12': '12-மணி',
        'hour24': '24-மணி',
        'quickActions': 'விரைவு செயல்கள்',
        'resetSettings': 'அமைப்புகளை மீட்டமைக்க',
        'restoreDefaults': 'இயல்புநிலைகளை மீட்டமைக்க',
        'saveChanges': 'மாற்றங்களை சேமிக்க',
        'settingsSaved': 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!'
    }
};

// Database simulation (in a real app, use MongoDB/MySQL etc.)
let userSettings = {};

// API Endpoints

// Get user settings
app.get('/api/settings', (req, res) => {
    const userId = req.cookies.userId || req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const settings = userSettings[userId] || {
        darkMode: true,
        fontSize: 'medium',
        ttsEnabled: true,
        audioNotifEnabled: true,
        highContrast: false,
        reduceMotion: false,
        screenReaderEnabled: true,
        enhancedDescEnabled: true,
        navHintsEnabled: true,
        voiceVolume: 80,
        language: 'en',
        timeFormat: '12-hour'
    };
    
    res.json(settings);
});

// Save user settings
app.post('/api/settings', (req, res) => {
    const userId = req.cookies.userId || req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const settings = req.body;
    userSettings[userId] = settings;
    
    // Broadcast to all connected clients (using WebSockets in real app)
    // Here we just return success
    res.json({ 
        success: true,
        message: translations[settings.language || 'en'].settingsSaved
    });
});

// Get translations
app.get('/api/translations/:lang', (req, res) => {
    const lang = req.params.lang;
    if (translations[lang]) {
        res.json(translations[lang]);
    } else {
        res.status(404).json({ error: 'Language not supported' });
    }
});

// Language switch endpoint
app.post('/api/language', (req, res) => {
    const { language } = req.body;
    if (!translations[language]) {
        return res.status(400).json({ error: 'Unsupported language' });
    }
    
    // In a real app, you would save this to user preferences
    res.cookie('language', language, { maxAge: 900000, httpOnly: true });
    res.json({ success: true, language });
});

// Serve HTML files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// =============================================================================
// ### (c) Karl Dentrich jun.
var versionString = "### SRSS.js 2023-01-22; (c) Karl Dentrich jun. ";
// 2023-01-22 AnonymousSelfInvoker for module-tests via NodeJS. Added: srss_log_now,  runsInBrowser detection.
// 2018-05-28 moved to personal page
// 2015-05-22 JSHINT via node.js
// 2014-06-14 (CIVIL, buergerliche daemmerung, SERA definition nr. 97)
// 2010-07-03 lokale_sternzeit, ephem-sonne
// 2009-06-01
// 2008-08-26
// =============================================================================

//### switches of jslint see http://www.jslint.com/
// https://de.wikipedia.org/wiki/JSLint
// https://www.jslint.com/
/*jslint nomen: false, white: false */
/*jslint maxerr: 100 */
/*jslint maxerr: 15 */
/*jslint debug: true */


/*jslint browser: true */
/*global alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false */
/*global addEventListener: false, blur: false, clearInterval: false, clearTimeout: false, close: false, closed: false, defaultStatus: false, document: false, event: false, focus: false, frames: false, getComputedStyle: false, history: false, Image: false, length: false, location: false, moveBy: false, moveTo: false, name: false, navigator: false, onblur: true, onerror: true, onfocus: true, onload: true, onresize: true, onunload: true, open: false, opener: false, Option: false, parent: false, print: false, resizeBy: false, resizeTo: false, screen: false, scroll: false, scrollBy: false, scrollTo: false, setInterval: false, setTimeout: false, status: false, top: false, XMLHttpRequest: false */

/*global document */
/*global naval_srss_year_day: true */
/*global srss_naval_: true */


// -------------------
// "u s e   strict";
// node   --no-warnings

// -------------------
// https://www.youtube.com/watch?v=mK54Cn4ceac
// NOT FOR BROWSER!
// require('./mathLib.js');
// mathLib_main();

// =============================================================================
//
//	PseudoHeader for DateMeta
//	<meta name="date"		content="2020-01-20">
//

// =============================================================================
// Detect, if script runs in browser or in nodejs!
// ---
// https://stackoverflow.com/questions/34550890/how-to-detect-if-script-is-running-in-browser-or-in-node-js
// https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
// https://www.npmjs.com/package/detect-is-node
// https://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
var runsInBrowser = true;
if (typeof window === 'undefined')
{
	runsInBrowser= false;
}


// =============================================================================
function	srss_test_alert()	{
	alert("srss-test");
}

// =============================================================================
function	srss_main()	{
	console.info("###SRSS : srss_main: ");
	console.log(versionString);
}



// =============================================================================
function	runden(zahl,kommastellen)
{
	var fakt = Math.pow(10.0, kommastellen);
	zahl *= fakt;
	zahl = Math.round(zahl);
	zahl /= fakt;
	return zahl;
}

// =============================================================================
function	adjustLeadingZero (item)	{
	return (((0+item) < 10) ? "0" + item : "" + item);
}

// =============================================================================
function	wochenTag(year,month,day)	{
	var jetzt = new Date();
	jetzt.setFullYear(0+year);
	jetzt.setMonth(0+(month-1));
	jetzt.setDate(0+day);

	var TagInWoche = jetzt.getDay();
	// var Wochentag = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
	var Wochentag = new Array("Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam");

	console.log ("" + year + "_" + month + "_" + day + " ~~ " + Wochentag[TagInWoche] + " -- " + jetzt.toString() );

	return "" + Wochentag[TagInWoche];
}


// =============================================================================
function	frac_hour2str(frac_hour)	{
		var h_str, h_full, m_str, min;

		// h_full	= frac_hour.toFixed(0);
		h_full	= Math.floor(frac_hour);

		min = ((frac_hour - h_full)*60.0);
		min = Math.abs(min);
		// min = min.toFixed(0);
		min = Math.floor(min);


		h_str = "";
		if (h_full < 10)
		{
			h_str += "0";
		}
		h_str += h_full;

		m_str = "";
		if (min < 10)
		{
			m_str += "0";
		}
		m_str += min;


		return (h_str + ":" + m_str);
}




// =============================================================================
function	deg2rad(deg)	{
		return ((deg * Math.PI) / 180.0);
}
// =============================================================================
function	rad2deg(rad)	{
		return ((rad * 180) / Math.PI);
}
// =============================================================================
function	deg2hour(deg)	{
		return ((deg*24.0) / 360.0);
}
// =============================================================================
function	hour2deg(hour)	{
		return ((hour*360.0) / 24.0);
}






// =============================================================================
function	srss_calc()
{
	var linefeed_str="\n";
	var	lati, longi, lati_rad, nun, diff , T, woz_moz,
		h_rad, dekli_rad,
		sr, ss, t_diff, str, longi_korr,
		neujahr;
	var     strsep = '	';

	linefeed_str += "<br>";
	// alert('srss');


	// --- EDPJ
	lati  = 48.5;
	longi = 9.633;

	// geogr. Breite ins Bogenmasz
	lati_rad  = deg2rad(lati);

	// alert(sr);

	nun = new Date();
	// cal = Calendar.getInstance();
	neujahr = new Date(nun.getFullYear(),0,1, 0,0,0);

	diff = (nun.getTime() / 1000)  - (neujahr.getTime() / 1000);
	diff /= 3600;
	diff /= 24;
	// alert(diff);

	T = Math.floor(diff +1 );
	// alert("dayofyear:" + T);


	// Zeitgleichung in Stunden (wahre minus mittlere Ortszeit)
	woz_moz = -0.1752*Math.sin(0.033430 * T + 0.5474) - 0.1340*Math.sin(0.018234*T	- 0.1939);

	// alert(woz_moz);

	// Deklination der Sonne
	dekli_rad = 0.40954*(Math.sin(0.0172*(T - 79.35)));


	// Zeitdifferenz:
	h_rad  = -0.0145; /* -50bogenminuten */

/*jsl:ignore*/
/*jslint laxbreak: true */
	t_diff = 12.0
			*Math.acos
			(
				(
					Math.sin(h_rad)
					- Math.sin(lati_rad)*Math.sin(dekli_rad)
				)
				/ (Math.cos(lati_rad)*Math.cos(dekli_rad))
			)
			/ Math.PI;
/*jslint laxbreak: false */
/*jsl:end*/

	/* wahre Ortszeit: (Kulmination auf 12 Uhr Mittags festgelegt) */
	sr = 12.0 - t_diff;
	ss = 12.0 + t_diff;
	/* mittlere  Ortszeit: */
	sr -= woz_moz;
	ss -= woz_moz;

	/* Uhrzeit (MEZ): */
		/* wir sind nicht auf dem 15 Laengengrad */
	longi_korr = (15.0 -longi)/15.0;
	sr += longi_korr;
	ss += longi_korr;

	/* Uhrzeit (auf UTC/GMT): */
	sr -= 1.0;
	ss -= 1.0;

	//	System.out.print(strsep + frac_hour2str(sr));
	//	System.out.print(strsep + frac_hour2str(ss));
	// alert("SR: " + sr);
	// alert("SS: " + ss);
	str = "EDPJ, [UTC]:" + linefeed_str;
	str += "SR: " + frac_hour2str(sr) + linefeed_str;
	str += "SS: " + frac_hour2str(ss);
	//  + "\n";  + linefeed_str;

	str += linefeed_str + "woz-moz: ";
	// str += Math.floor(woz_moz * 60);
	woz_moz *= 1000;
	woz_moz *= 60;
	woz_moz = Math.floor(woz_moz);
	woz_moz /= 1000;
	str += (woz_moz.toString()) + " min";

	str += linefeed_str + "longi-korr: ";
	str += Math.floor(longi_korr * 60) + " min";
	// alert(str);

	return str;
}


// =============================================================================
function	woz_moz_calc()
{
	var	lati, longi, lati_rad, nun, diff , T, woz_moz,
		sr, ss, t_diff, str, longi_korr, neujahr;

	woz_moz = 0.0;
	var strsep = '	';

	// alert('woz_moz_calc');


	// --- EDPJ
	lati  = 48.5;
	longi = 9.633;

	// geogr. Breite ins Bogenmasz
	lati_rad  = deg2rad(lati);

	nun = new Date();
	// cal = Calendar.getInstance();
	neujahr = new Date(nun.getFullYear(),0,1, 0,0,0);

	diff = (nun.getTime() / 1000)  - (neujahr.getTime() / 1000);
	diff /= 3600;
	diff /= 24;
	// alert(diff);

	T = Math.floor(diff +1 );
	// alert("dayofyear:" + T);


	// Zeitgleichung in Stunden (wahre minus mittlere Ortszeit)
	woz_moz = -0.1752*Math.sin(0.033430 * T + 0.5474) - 0.1340*Math.sin(0.018234*T	- 0.1939);

		/* wir sind nicht auf dem 15 Laengengrad */
	longi_korr = (15.0 -longi)/15.0;

	str = "\nwoz-moz: ";
	// str += Math.floor(woz_moz * 60);
	woz_moz *= 1000;
	woz_moz *= 60;
	woz_moz = Math.floor(woz_moz);
	woz_moz /= 1000;
	str += (woz_moz.toString()) + " min";

	// str += ";&nbsp;&nbsp;&nbsp; ";
	// str += "\nlongi-korr: ";
	// str += Math.floor(longi_korr * 60) + " min";
	// alert(str);

	return str;
}

// =============================================================================
function	srss_calc_show()
{
	alert(srss_calc());
}



// =============================================================================
function	nun_show()	{
	var nun = new Date();
	return nun.toString();
}



// =============================================================================
// -- http://williams.best.vwh.net/sunrise_sunset_example.htm
// =============================================================================
function	srss_naval(year,month,day,latitude,longitude,linefeed_str,isCivil)
{
	var	N, N1, N2, N3, t1, t2, lngHour, M1, M2, M1_rad, M2_rad, L1, L2, L1_rad, L2_rad, x1, x2, y1, y2, z1, z2, RA1, RA2, RAquadrant, Lquadrant, sinDec1, sinDec2, cosDec1, cosDec2, cos_zenith, latitude_rad, cosH1, cosH2, H1, H2, T1, T2, UT1, UT2, str1, str2, str, nun;


	console.log("srss_naval: " + year + "-" + adjustLeadingZero(month) + "-" + adjustLeadingZero(day));


// longitude = - longitude;

// Sunrise/Sunset Algorithm Example
//
// Source:
// 	Almanac for Computers, 1990
// 	published by Nautical Almanac Office
// 	United States Naval Observatory
// 	Washington, DC 20392
//
// Inputs:
// 	day, month, year:      date of sunrise/sunset
// 	latitude, longitude:   location for sunrise/sunset
// 	zenith:                Sun's zenith for sunrise/sunset
// 	  offical      = 90 degrees 50'
// 	  civil        = 96 degrees
// 	  nautical     = 102 degrees
// 	  astronomical = 108 degrees
//
// 	NOTE: longitude is positive for East and negative for West
//
// Worked example (from book):
// 	June 25, 1990:	25, 6, 1990
// 	Wayne, NJ:      40.9, -74.3
// 	Office zenith:  90 50' cos(zenith) = -0.01454
//
//
// 1. first calculate the day of the year
//
	N1 = Math.floor(275 * month / 9);
	N2 = Math.floor((month + 9) / 12);
	N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3));
	N = N1 - (N2 * N3) + day - 30;

//-- alert("N: " + N);
//
// 	Example:
// 	N1 = 183
// 	N2 = 1
// 	N3 = 1 + floor((1990 - 4 * 497 + 2) / 3)
// 	   = 1 + floor((1990 - 1988 + 2) / 3)
// 	   = 1 + floor((1990 - 1988 + 2) / 3)
// 	   = 1 + floor(4 / 3)
// 	   = 2
// 	N = 183 - 2 + 25 - 30 = 176
//
// 2. convert the longitude to hour value and calculate an approximate time
//
	lngHour = longitude / 15.0;
//-- alert("lngHour: " + lngHour);

//
// 	if rising time is desired:
	  t1 = N + (( 6.0 - lngHour) / 24.0);
// 	if setting time is desired:
	  t2 = N + ((18.0 - lngHour) / 24.0);

//-- alert("t1: " + t1);

//
// 	Example:
// 	lngHour = -74.3 / 15 = -4.953
// 	t = 176 + ((6 - -4.953) / 24)
// 	  = 176.456
//
// 3. calculate the Sun's mean anomaly
//
	M1 = (0.9856 * t1) - 3.289;
	M2 = (0.9856 * t2) - 3.289;

//-- alert("M1: " + M1);

//
// 	Example:
// 	M = (0.9856 * 176.456) - 3.289
// 	  = 170.626
//
// 4. calculate the Sun's true longitude
//        [Note throughout the arguments of the trig functions
//        (sin, tan) are in degrees. It will likely be necessary to
//        convert to radians. eg sin(170.626 deg) =sin(170.626*pi/180
//        radians)=0.16287]
//
	M1_rad = deg2rad(M1);
	M2_rad = deg2rad(M2);
	L1 = M1 + (1.916 * Math.sin(M1_rad)) + (0.020 * Math.sin(2.0 * M1_rad )) + 282.634;
	L2 = M2 + (1.916 * Math.sin(M2_rad)) + (0.020 * Math.sin(2.0 * M2_rad )) + 282.634;

//--	alert("L: " + L);
 	L1 = L1 % 360.0;
 	L2 = L2 % 360.0;
//-- alert("L1: " + L1);


// 	NOTE: L potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
//
// 	Example:
// 	L = 170.626 + (1.916 * sin(170.626)) + (0.020 * sin(2 * 170.626)) + 282.634
// 	  = 170.626 + (1.916 * 0.16287) + (0.020 * -0.32141) + 282.634
// 	  = 170.626 + 0.31206 + -0.0064282 + 282.634
// 	  = 453.566 - 360
// 	  = 93.566
//
// 5a. calculate the Sun's right ascension
//
	L1_rad = deg2rad(L1);
	L2_rad = deg2rad(L2);

	x1 = Math.tan(L1_rad);
	x2 = Math.tan(L2_rad);

	y1 = 0.91764 * x1;
	y2 = 0.91764 * x2;

	z1 = Math.atan(y1);
	z2 = Math.atan(y2);

	RA1 = rad2deg(z1);	// in degree !
	RA2 = rad2deg(z2);	// in degree !
// -- alert("RA1_deg: " + RA1);


// 	NOTE: RA potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
//
// 	Example:
// 	RA = atan(0.91764 * -16.046)
// 	   = atan(0.91764 * -16.046)
// 	   = atan(-14.722)
// 	   = -86.11412
//
// 5b. right ascension value needs to be in the same quadrant as L
//
	Lquadrant  = (Math.floor( L1/90.0)) * 90.0;
	RAquadrant = (Math.floor(RA1/90.0)) * 90.0;
 	RA1 = RA1 + (Lquadrant - RAquadrant);

 	Lquadrant  = (Math.floor( L2/90.0)) * 90.0;
 	RAquadrant = (Math.floor(RA2/90.0)) * 90.0;
 	RA2 = RA2 + (Lquadrant - RAquadrant);

//- alert("RA1: " + RA1);

//
// 	Example:
// 	Lquadrant  = (floor(93.566/90)) * 90
// 	           = 90
// 	RAquadrant = (floor(-86.11412/90)) * 90
// 	           = -90
// 	RA = -86.11412 + (90 - -90)
// 	   = -86.11412 + 180
// 	   = 93.886
//
// 5c. right ascension value needs to be converted into hours
//
 	RA1 = RA1 / 15.0;
 	RA2 = RA2 / 15.0;
//-- alert("RA1_h: " + RA1);

//
// 	Example:
// 	RA = 93.886 / 15
// 	   = 6.259
//
// 6. calculate the Sun's declination
//
 	// alert("L_deg: " + rad2deg(L_rad));
 	sinDec1 = 0.39782 * Math.sin(L1_rad);
 	sinDec2 = 0.39782 * Math.sin(L2_rad);
//--	alert("sinDec1: " + sinDec1);
//--	alert("sinDec2: " + sinDec2);

 	x1 = Math.asin(sinDec1);
 	x2 = Math.asin(sinDec2);
 	// alert("mau_x: " + x);

 	cosDec1 = Math.cos(x1);
 	cosDec2 = Math.cos(x2);

//-- 	alert("cosDEC1: " + cosDec1);
//-- 	alert("cosDEC2: " + cosDec2);

// 	Example:
// 	sinDec = 0.39782 * sin(93.566)
// 	       = 0.39782 * 0.99806
// 	       = 0.39705
// 	cosDec = cos(asin(0.39705))
// 	       = cos(asin(0.39705))
// 	       = cos(23.394)
// 	       = 0.91780
//
// 7a. calculate the Sun's local hour angle
//
// 	cosH = (cos(zenith) - (sinDec * sin(latitude))) / (cosDec * cos(latitude))

	// Office zenith:  90 50' cos(zenith) = -0.01454
	// 90,833333 degree
	cos_zenith = -0.01454;
	if (0 !== (0 + isCivil))
	{
		// zenit-distanz civil        = 96 degrees
		// cos(96�)= -0,1045284632676534713998341548025
		cos_zenith = -0.1045284632676534713998341548025;
	}

	latitude_rad = deg2rad(latitude);
	cosH1 = (cos_zenith - (sinDec1 * Math.sin(latitude_rad))) / (cosDec1 * Math.cos(latitude_rad));
	cosH2 = (cos_zenith - (sinDec2 * Math.sin(latitude_rad))) / (cosDec2 * Math.cos(latitude_rad));

//-- alert("cosH1: " + cosH1*12);
//-- alert("cosH2: " + cosH2*12);

//
// 	if (cosH >  1)
// 	  the sun never rises on this location (on the specified date)
// 	if (cosH < -1)
// 	  the sun never sets on this location (on the specified date)
//
// 	Example:
// 	cosH = (-0.01454 - (0.39705 * sin(40.9))) / (0.91780 * cos(40.9))
// 	     = (-0.01454 - (0.39705 * 0.65474)) / (0.91780 * 0.75585)
// 	     = (-0.01454 - 0.25996) / 0.69372
// 	     = -0.2745 / 0.69372
// 	     = -0.39570
//
// 7b. finish calculating H and convert into hours
//
// 	if rising time is desired:
// 	  H = 360 - acos(cosH)

	  H1 = 360 - rad2deg(Math.acos(cosH1)); // degree

// 	if setting time is desired:
// 	  H = acos(cosH)
//
// KD !!! wenn negative, do 360+
	  H2 = 360+ rad2deg(Math.acos(cosH2));

	H1 = H1 / 15.0;
	H2 = H2 / 15.0;
//-- alert("H1: " + H1);
//-- alert("H2: " + H2);

//
// 	Example:
// 	H = 360 - acos(-0.39570)
// 	  = 360 - 113.310   [ note result of acos converted to degrees]
// 	  = 246.690
// 	H = 246.690 / 15
// 	  = 16.446
//
// 8. calculate local mean time of rising/setting
//
	T1 = H1 + RA1 - (0.06571 * t1) - 6.622;
	T2 = H2 + RA2 - (0.06571 * t2) - 6.622;
//--	alert("T: " + T);

//
// 	Example:
// 	T = 16.446 + 6.259 - (0.06571 * 176.456) - 6.622
// 	  = 16.446 + 6.259 - 11.595 - 6.622
// 	  = 4.488
//
// 9. adjust back to UTC
//
	UT1 = T1 - lngHour;
	UT2 = T2 - lngHour;
//-- alert("UT1: " + UT2);
//-- alert("UT2: " + UT2);

	if (UT1 >= 24.0) { UT1 -= 24.0; }
	if (UT2 >= 24.0) { UT2 -= 24.0; }

// 	NOTE: UT potentially needs to be adjusted into the range [0,24) by adding/subtracting 24
//
// 	Example:
// 	UT = 4.488 - -4.953
// 	   = 9.441
// 	   = 9h 26m
//
// 10. convert UT value to local time zone of latitude/longitude
//
// 	localT = UT + localOffset
//
// 	Example:
// 	localT = 9h 26m + -4
// 	       = 5h 26m
// 	       = 5:26 am EDT
//

	str1 = frac_hour2str(UT1);
	str2 = frac_hour2str(UT2);
//--
	// str = "SunRise: " + str1 +  linefeed_str + "SunSet:  " + str2;
	var preStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	var midStr = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	str = preStr + "SR: " + str1 +  linefeed_str + midStr + "SS: " + str2;
	if (0 !== (0 + isCivil))
	{
		str = "CivilDusk: " + str1 +  linefeed_str + "CivilDawn: " + str2;
	}
	//--	alert(str);
	return str;
}

// =============================================================================
function	naval_srss_today(linefeed_str, isCivil)
{
	var	str, nun, year, mon, day, longitude, latitude;

	nun = new Date();
	year	= nun.getFullYear();
	mon	= nun.getMonth();
	day	= nun.getDate();

	mon += 1;
	console.log("naval_srss_today: " + year + "-" + adjustLeadingZero(mon) + "-" + adjustLeadingZero(day));

	// --- EDPJ
	latitude  = 48.5;
	longitude = 9.633;

	// srss_naval(2008,7,31);
	str = srss_naval(year,mon,day,latitude,longitude, linefeed_str,isCivil);


// TEST:
//	latitude  = 40.9;
//	longitude = -74.3;
// 	June 25, 1990:	25, 6, 1990
//	str = srss_naval(1990,6,25, latitude,longitude,"\n");

	// alert("naval_srss_today: " + str);
	return str;
}


// =============================================================================
function	naval_srss_year_day(year,mon,day,latitude,longitude,isCivil)
{
	// TODO http://de.selfhtml.org/javascript/objekte/date.htm#get_day
	var wDay, mon_, day_ ;
	var str;

	wDay = wochenTag (year,mon,day);

	mon_	= ((mon < 10) ? "0" + mon : "" + mon);
	day_	= ((day < 10) ? "0" + day : "" + day);
	str = "\n" + year + "-" + mon_ + "-" + day_ + ", " + wDay + " :\t";

	str += srss_naval(year,mon,day,latitude,longitude," -- ",isCivil);
	return str;
}


// =============================================================================
function	naval_srss_year(year,isCivil,outputMethod)
{
	var	str, nun, mon, day, longitude, latitude, txtOutput;

	// --- EDPJ
	latitude  = 48.5;
	longitude = 9.633;


	console.log("naval_srss_year: " + year );

	for (mon = 1; mon <= 12; mon++)
	{
		// for (day = 1; day <= 15; day += 14)
		for (day = 100000; day <= 30; day += 1)
		{
			str = naval_srss_year_day(year,mon,day,latitude,longitude);
			document.write("<BR>" + str );
		}

		if (0 === (0 + outputMethod))
		{
			str = naval_srss_year_day(year,mon, 1,latitude,longitude,isCivil);
			document.write("<BR>" + str );
			str = naval_srss_year_day(year,mon,10,latitude,longitude,isCivil);
			document.write("<BR>" + str );
			str = naval_srss_year_day(year,mon,20,latitude,longitude,isCivil);
			document.write("<BR>" + str );
		}
		else
		{
			//   === with (document.SRSS_form) // only allow in non-strict mode
			const form = document.SRSS_form;
			{
				form.txtOutput.value += naval_srss_year_day(year,mon, 1,latitude,longitude,isCivil);
				form.txtOutput.value += naval_srss_year_day(year,mon,10,latitude,longitude,isCivil);
				form.txtOutput.value += naval_srss_year_day(year,mon,20,latitude,longitude,isCivil);
				form.txtOutput.value += "\n";
			}
		}
	}
}




// =============================================================================
/* ***************************************** *
 * Date object expansion script              *
 * Adds extra date methods to all your dates *
 * copyright Stephen Chapman 30 Dec 2007     *
 * http://javascript.about.com/              *
 *                                           *
 * You may copy this script provided that no *
 * changes to the script or content are made *
 *                                           *
 * Additional methods added:                 *
 *   addDays(number_of_days_to_add)          *
 *   week_num = getWeek()                    *
 *   day_of_year = getDOY()                  *
 *   julian_day = getJulian()                *
 *   month_name = getMonthName()             *
 *   day_of_week = getDayName()              *
 * ***************************************** */

// Date.prototype.addDays = function(days) {this.setDate(this.getDate()+days);}
// Date.prototype.getWeek = function() {var onejan = new Date(this.getFullYear(),0,1); return Math.ceil((((this - onejan) / 86400000) + onejan.getDay())/7); }
// Date.prototype.getDOY = function() {var onejan = new Date(this.getFullYear(),0,1); return Math.ceil((this - onejan) / 86400000);}

// =============================================================================
Date.prototype.getTZoffset_minute = function() { return (this.getTimezoneOffset() ); };

// =============================================================================
Date.prototype.debug = function() {
	var item = "UTC" + this.getUTCHours() + ":" + this.getUTCMinutes() ;

	return item;
};

// =============================================================================
// ### http://de.wikipedia.org/wiki/Julianisches_Datum
// ### http://de.wikibooks.org/wiki/Astronomische_Berechnungen_f%C3%BCr_Amateure/_Kalender/_Julianisches_Datum
// ### http://www.ngc7000.org/astrotools/ephemtool.html  timezone berlin + dayligth-saving
Date.prototype.getJD = function() {
	var	yy, mm, dd, hour, mins, secs, A, B, H, JD, item, tst;

	yy	 =  this.getUTCFullYear();
	mm	 = (this.getUTCMonth()+1);
	dd	 =  this.getUTCDate();
	hour =	this.getUTCHours();
	mins =	this.getUTCMinutes();
	secs =	this.getUTCSeconds();

	// with UTC, similar to:

	if (mm <= 2 )
	{
		yy--;
		mm += 12;
	}

	// Gregorianischer Kalender: A = Int(Y/100), B = 2 - A + Int(A/4)
	A = Math.floor(yy/100);
	B = 2 - A + Math.floor(A/4);

	H = hour/24.0 + mins/1440.0 + secs/86400.0;
	JD = Math.floor(365.25*(yy+4716)) + Math.floor(30.6001*(mm+1)) + dd + H + B - 1524.5;

	item = JD;

	item *=1000;
	item = Math.floor(item);
	item /= 1000;

	tst = "" + hour + "," + mins + "," +secs;
	// item = tst;

	return item;
};


// =============================================================================
function get_JD(a_date) {
	var	yy, mm, dd, hour, mins, secs, A, B, H, JD, item, tst, nun;

	if (null === a_date) {
		nun = new Date();
	}
	else	{
		nun = a_date;
	}

	yy	 =  nun.getUTCFullYear();
	mm	 = (nun.getUTCMonth()+1);
	dd	 =  nun.getUTCDate();
	hour =  nun.getUTCHours();
	mins =  nun.getUTCMinutes();
	secs =  nun.getUTCSeconds();

	// with UTC, similar to:

	if (mm <= 2 )
	{
		yy--;
		mm += 12;
	}

	// Gregorianischer Kalender: A = Int(Y/100), B = 2 - A + Int(A/4)
	A = Math.floor(yy/100);
	B = 2 - A + Math.floor(A/4);

	H = hour/24.0 + mins/1440.0 + secs/86400.0;
	JD = Math.floor(365.25*(yy+4716)) + Math.floor(30.6001*(mm+1)) + dd + H + B - 1524.5;

	item = JD;

	item *=1000;
	item = Math.floor(item);
	item /= 1000;

	tst = "" + hour + "," + mins + "," +secs;
	// item = tst;

	return item;
}




// =============================================================================
// Date.prototype.debug = function() { return ((0 + this.getTime()) / 86400000) + 2440587.5; }
// =============================================================================
Date.prototype.getJulian = function() {
	var item = 0 +
	(
	//  getTime: [ms] since 1970-01-01, 00:00 UTC;	 getTimezoneOffset: [min]    [days]

//	 ( (0 + this.getTime()) / 86400000) - ((this.getTimezoneOffset())/1440)    + 2440587.5
	( (0 + this.getTime()) / 86400000) + 2440587.5 	);
	item *=1000;
	item = Math.floor(item);
	item /= 1000;
	return item;
	// Math.floor
};

// =============================================================================
// Date.prototype.getMonthName = function() {var m = ['January','February','March','April','May','June','July','August','September','October','November','December']; return m[this.getMonth()];}
// Date.prototype.getDayName = function() {var d = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; return d[this.getDay()];}


// =============================================================================
//FD local siderial time
//
// http://en.wikipedia.org/wiki/Sidereal_time
// http://answers.yahoo.com/question/index?qid=20070830185150AAoNT4i
// http://tycho.usno.navy.mil/sidereal.html
// http://www.pietro.org/Astro_Util_StaticDemo/FDetailSiderealConv.htm
// http://www.geoastro.de/SiderealTimeClock/index.html
//
// =============================================================================
function lokale_sternzeit(longitude)	{
	var	nun, my_tz_offset, utc_neujahr2000mittag, diff, GMST, LST, lst_hh, lst_mm, lst_hh_str, lst_mm_str;

	// cal = Calendar.getInstance();
	// var utc_neujahr2000mittag = new Date();
	// utc_neujahr2000mittag.setFullYear()	= 2000;
	// utc_neujahr2000mittag.setUTCMonth()	=    0;
	// utc_neujahr2000mittag.setUTCDate()	=    1;
	// utc_neujahr2000mittag.setUTCHours()	= 12;
	// utc_neujahr2000mittag.setUTCMinutes()	=  0;
	// utc_neujahr2000mittag.setUTCSeconds()	=  0;

	// ---- reference date 2000-01-01, 12:00 UTC in greenwich
	nun = new Date();
	my_tz_offset = 1;  // 1 : berlin
	utc_neujahr2000mittag = new Date(2000,0,1, (12  + my_tz_offset),0,0);

	// tz_offset = nun.getTimezoneOffset() / 60;
	// alert("utc2000: " + utc_neujahr2000mittag.toString() );
	// alert("tz: " + tz_offset);

	// nun = new Date(nun.getFullYear(), (7-1),1, 11,45,0);
	// var nun = new Date(2010,0,1,   12,0,0);
	// var nun = new Date(2010,(7-1),1,   (12),20,0); // 2010-07-01, 12:20 MESZ == GMST 4:57
	// alert("NUN: " + nun);

	// ---	  t-diff in seconds
	diff = (nun.getTime() / 1000)  - (utc_neujahr2000mittag.getTime() / 1000);
	// ----   t-diff in days, (== arg of formula)
	diff /= 3600;
	diff /= 24;
	// alert("diff-days: " + diff);


	// http://en.wikipedia.org/wiki/Sidereal_time
	//	greenwich
	//var GMST = 18.697374558 + 24.06570982441908 * diff;
	//GMST %= 24.0;
	//	alert("GMST: " + GMST);

	//gmst_hh = Math.floor(GMST);
	//gmst_mm = GMST - gmst_hh;
	//gmst_mm *= 60.0;
	//gmst_mm = Math.floor(gmst_mm);
	//
	//var gmst_hh_str = gmst_hh.toString();
	//if (gmst_hh < 10)	gmst_hh_str = "0" + gmst_hh_str;
	//var gmst_mm_str = gmst_mm.toString();
	//if (gmst_mm < 10)	gmst_mm_str = "0" + gmst_mm_str;
	//	alert("GMST: " + gmst_hh_str +	":"  + gmst_mm_str);


	// ---	 local siderial time, considers longitude!
	// ---	 jormula of  http://en.wikipedia.org/wiki/Sidereal_time
	GMST = 18.697374558 + 24.06570982441908 * diff;  // at greenwich
	LST = GMST + (longitude/15.0);	// at given longitude
	LST %= 24.0;

	// lst_hh = Math.floor(LST);
	lst_hh = Math.floor(LST);
	lst_mm = LST - lst_hh;
	lst_mm *= 60.0;
	lst_mm = Math.floor(lst_mm);

	lst_hh_str = lst_hh.toString();
	if (lst_hh < 10)	{ lst_hh_str = "0" + lst_hh_str; }
	lst_mm_str = lst_mm.toString();
	if (lst_mm < 10)	{ lst_mm_str = "0" + lst_mm_str; }
	// alert("LST: " + lst_hh_str +  ":"  + lst_mm_str);

	return "LST: " + lst_hh_str +  ":"  + lst_mm_str;
}


// =============================================================================
function days_since_J2000(a_date)	{
	var	nun, my_tz_offset, utc_neujahr2000mittag, diff;

	if (null === a_date) {
		nun = new Date();
	}
	else	{
		nun = a_date;
	}

	my_tz_offset = 1;  // 1 : berlin
	utc_neujahr2000mittag = new Date(2000,0,1, (12  + my_tz_offset),0,0);

	// ---	  t-diff in seconds
	diff = (nun.getTime() / 1000)  - (utc_neujahr2000mittag.getTime() / 1000);
	// ----   t-diff in days
	diff /= 3600;
	diff /= 24;
	// alert("diff-days: " + diff);

	return diff;
}

// =============================================================================
function ekl_laenge_sonne(nun)	{
	var	JD, tz_offset, ms, n, L, g, g_rad, e, lambda;

	if (null === nun)	{	nun = new Date();	}

	// var nun = new Date(2010,7,3,  12,0,0);
	// var JD = nun.getJulian();   // UTC,
	JD = get_JD(nun);	// UTC
	// alert("JD: " + JD);

	tz_offset = nun.getTimezoneOffset(); // minutes

	ms = nun.getTime();
	// ms += (tz_offset * 60 * 1000);  // into mili-secs
	nun.setTime(ms);
	// alert("UT: " + nun);

	n = JD - 2451545.0;
	// alert ("" + (n - days_since_J2000(nun)) );

	L = 280.460 + 0.9856474 * n;  // [grad], mittlere ekliptikale L�nge L  der Sonne (bezl Widder/Fruehlingspunkt des J2000, und der anzahl 'n' der tags seit damals)
	L %= 360.0;
	// alert("mittl-ekl-laenge: " + L);

	// ra = L *24.0 / 360.0;
	// frac_hour2str(ra);

	g = 357.528 + 0.9856003 * n; // [grad]
	g %= 360.0;

	g_rad = deg2rad(g);
	e = 0.0167; // Exzentrizit�t der Sonne
	// var x = 2*e	* sin(g_rad) + 5/4*e*e*sin(2*e_rad);
	lambda = L + 1.915*Math.sin(g_rad) + 0.020*Math.sin(2*g_rad);
	// alert("laenge: " + lambda);

	return lambda;
}


// =============================================================================
function rekta_sonne(tage_seit_j2000, ekl_laenge)	{
	var	epsilon, e_rad, ekl_laenge_rad, xxx, alpha;

	epsilon = 23.439 - 0.0000004 * tage_seit_j2000;	// schiefe der ekliptic
	e_rad = deg2rad(epsilon);
	ekl_laenge_rad = deg2rad(ekl_laenge);

	xxx = ( Math.cos(e_rad) * Math.sin(ekl_laenge_rad) ) / Math.cos(ekl_laenge_rad);
	alpha = Math.atan(xxx);
	alpha = rad2deg(alpha);
	if (alpha < 0.0)	{ alpha += 180.0; }

	return alpha;
}

// =============================================================================
function delta_sonne(tage_seit_j2000, ekl_laenge)	{
	var	epsilon, e_rad, ekl_laenge_rad, xxx, delta;

	epsilon = 23.439 - 0.0000004 * tage_seit_j2000;	// schiefe der ekliptic
	e_rad = deg2rad(epsilon);
	ekl_laenge_rad = deg2rad(ekl_laenge);

	xxx = ( Math.sin(e_rad) * Math.sin(ekl_laenge_rad) );
	delta = Math.asin(xxx);
	delta = rad2deg(delta);

	return delta;
}





// =============================================================================
function srss_test() {


	// alert("srss-test");
	// --- print("srss-test:\n" +  srss_calc() );
	// srss_calc_show();


// Es ist der Sonnenstand fuer den 6. August 2006 um 8 Uhr MESZ (T = 6 Uhr UT)
	var now = new Date(2006, (8 - 1), 6,  8, 0, 0);  // hier MESZ angeben
	// var now = new Date();

// JD = 2453953,75
//	  2453953.75
// n  = 2408,75 tage
// Lambda = 133,653 grad

	var _tage_seit_j2000 = days_since_J2000(now);
	var _jd  = get_JD(now);
	var _jd_from_date_class  = now.getJD(now);
	var _ekl_laenge_sonne = ekl_laenge_sonne(now);
	var _rekta_sonne   = rekta_sonne(_tage_seit_j2000, _ekl_laenge_sonne);
	var _delta_sonne   = delta_sonne(_tage_seit_j2000, _ekl_laenge_sonne);

	var stellen = 3;
	_ekl_laenge_sonne = runden(_ekl_laenge_sonne, stellen);
	_rekta_sonne	  = runden(_rekta_sonne, stellen);
	_delta_sonne	  = runden(_delta_sonne, stellen);


	if (false)
	{
		print("\nsrss-test:\n" + now);
		print("\nsrss-test:\n" + _jd +" == 2453953.75");
		print("\nsrss-test:\n" + _jd_from_date_class +" from class");
		print("\nsrss-test:\n" + _tage_seit_j2000	+" == 2408.75" );
		print("\nsrss-test:\n" + _rekta_sonne		+" == 136.119" );
		print("\nsrss-test:\n" + _delta_sonne		+" == 16.726" );
		print("\nsrss-test:\n" + "ende");
	}
	else
	{
		let linefeed = "\n";
		console.log("\nsrss-test:\n" + now);
		console.log("\nsrss-test:\n" + _jd +" == 2453953.75");
		console.log("\nsrss-test:\n" + _jd_from_date_class +" from class");
		console.log("\nsrss-test:\n" + _tage_seit_j2000	+" == 2408.75" );
		console.log("\nsrss-test:\n" + _rekta_sonne		+" == 136.119" );
		console.log("\nsrss-test:\n" + _delta_sonne		+" == 16.726" );
		console.log("\nsrss-test:\n" + "ende");

	}


}


// =============================================================================
function srss_log_now() {
	var now = new Date();

	// https://de.wikipedia.org/wiki/%C3%84quinoktium
	// https://www.w3schools.com/js/js_date_formats.asp
	// var now = new Date(2023, (3-1), 20,    22, 24, 0);

	var _tage_seit_j2000 = days_since_J2000(now);
	var _jd  = get_JD(now);
	var _jd_from_date_class  = now.getJD(now);
	var _ekl_laenge_sonne = ekl_laenge_sonne(now);
	var _rekta_sonne   = rekta_sonne(_tage_seit_j2000, _ekl_laenge_sonne);
	var _delta_sonne   = delta_sonne(_tage_seit_j2000, _ekl_laenge_sonne);

	var stellen = 3;
	_ekl_laenge_sonne = runden(_ekl_laenge_sonne, stellen);
	_rekta_sonne	  = runden(_rekta_sonne, stellen);
	_delta_sonne	  = runden(_delta_sonne, stellen);
	stellen = 1;
	_jd               = runden(_jd, stellen);
	_tage_seit_j2000  = runden(_tage_seit_j2000, stellen);


	let linefeed = ""; // "\n";
	console.log(linefeed + "srss_log_now: " + now);
	console.log(linefeed + "srss_log_now: " + _jd               +" JD");
	console.log(linefeed + "srss_log_now: " + _tage_seit_j2000	+ " tage_seit_j2000" );
	console.log(linefeed + "srss_log_now: " + _rekta_sonne		+ " rekta_sonne" );
	console.log(linefeed + "srss_log_now: " + _delta_sonne		+ " delta_sonne" );

}

// =============================================================================
function srss_dbglog_now() {
	var now = new Date();

	var _tage_seit_j2000 = days_since_J2000(now);
	// var _jd  = get_JD(now);
	// var _jd_from_date_class  = now.getJD(now);
	var _ekl_laenge_sonne = ekl_laenge_sonne(now);
	// var _rekta_sonne   = rekta_sonne(_tage_seit_j2000, _ekl_laenge_sonne);
	var _delta_sonne   = delta_sonne(_tage_seit_j2000, _ekl_laenge_sonne);

	var is_lat = false;
	var _delta_sonne_dms = deg2ggmmss(_delta_sonne,is_lat);

	var stellen = 3;
	// _ekl_laenge_sonne = runden(_ekl_laenge_sonne, stellen);
	// _rekta_sonne	  = runden(_rekta_sonne, stellen);
	_delta_sonne	  = runden(_delta_sonne, stellen);

	let linefeed = ""; // "\n";
	// console.log(linefeed + "srss_dbglog_now: " + _rekta_sonne		+ " rekta_sonne" );
	// console.log(linefeed + "srss_dbglog_now: " + _delta_sonne		+ " delta_sonne" );

	return "srss_dbglog_now: " + _delta_sonne	+ " ~ " + _delta_sonne_dms	+ " delta_sonne";
}


// =============================================================================
// =============================================================================
// =============================================================================
// https://developer.mozilla.org/en/Rhino
// https://developer.mozilla.org/en/Rhino_documentation
// https://developer.mozilla.org/en/Scripting_Java
//
// http://java.sun.com/javase/6/docs/technotes/tools/share/jrunscript.html
// use java6;	jrunscript -l js -f srss.js
// -or-
// java -classpath p:\java\rhino1_7R2\js.jar org.mozilla.javascript.tools.shell.Main  -f   srss.js

// !!! test call is at end, so the interpreter may read Date.proto definitions
// !!! to recognize date.getJD expansions
// !!! comment for non-test-usage!!!
// !!! otherwise printing on paper-printer will occur
// ---------  srss_test();


// =============================================================================
// Anonymous Self-Invoking Function, as Arrow Function, note the braces ()
((act_param) => {
	console.log("###SRSS.js : SIF, as arrow, arg: (%s), call srss_main ", act_param);

	if (true == act_param)
	{
		srss_main();
	}
	else
	{
		console.log(naval_srss_today("\n", 1));
	}

})(runsInBrowser);


// =============================================================================
// Self-Invoking Function, to call main or other function from console
// http://esbueno.noahstokes.com/post/77292606977/self-executing-anonymous-functions-or-how-to-write
(function() {
	// alert('Hello World');
	// console.log("###SRSS-js : SIF, call tests.");
	// srss_test();
	// srss_log_now();
})();


// not at NodeJS :
// export {
// 	naval_srss_today
//};

// JavaScript Modules with Import/Export Syntax (ES6) - JavaScript Tutorial
// https://www.youtube.com/watch?v=s9kNndJLOjg
//  	<script type="module" src="srss.js"></script>
//      then needs export keyword



// =============================================================================
// ==========================================================================eof

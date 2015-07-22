#pragma strict

public static var KILLED : int = 0;
public static var ESCAPED : int = 0;
public static var GOLD : int = 10000;

function OnGUI()
{
	GUI.Box (Rect (Screen.width - 100,0,100,30), "Killed = " + Level.KILLED);
	GUI.Box (Rect (Screen.width - 100,30,100,30), "Escaped = " + Level.ESCAPED);
	GUI.Box (Rect (Screen.width - 100,60,100,30), "Gold = " + Level.GOLD);
}
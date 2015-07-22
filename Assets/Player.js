#pragma strict
//private var modeButtons : Rect[];
//public var modeButtonSkins : GUISkin[] = new GUISkin[3];
var mainOutlineSkin : GUISkin;
var towerOutlineSkin : GUISkin;
var attackOutlineSkin : GUISkin;
private var mode : int = 0;

function Start()
{
	/*
	modeButtons = new Rect[3];
	for(var j : int = 0; j < modeButtons.length; j++)
	{
		modeButtons[j] = Rect(Screen.width * (.38 + (.1 * j)), Screen.height*.815, Screen.width*.05, Screen.height*.07);
	}
	*/
}
function Update () 
{
	/*
	if(Input.GetButtonDown("Mode"))
	{
		switch(mode)
		{
			case 0: 
				mode = 1;
				gameObject.GetComponent(Build).enabled = true;
				gameObject.GetComponent(Sell).enabled = false;
				break;
			case 1: 
				mode = 2;
				gameObject.GetComponent(Build).cleanUp();
				gameObject.GetComponent(Build).enabled = false;
				gameObject.GetComponent(Sell).enabled = true;
				break;
			case 2: 
				mode = 0;
				gameObject.GetComponent(Build).enabled = false;
				gameObject.GetComponent(Sell).enabled = false;
				break;
		}
	}
	*/
}

function OnGUI()
{
	/*
	GUI.skin = mainOutlineSkin;
	GUI.Box(Rect(Screen.width*.35, Screen.height*.8, Screen.width*.3, Screen.height*.1), "");
	for(var j : int = 0; j < 3; j++)
	{
		GUI.skin = modeButtonSkins[j];
		if(GUI.Button(modeButtons[j], ""))
		{
			switch(j)
			{
				case 0:
					gameObject.GetComponent(BuildGUI).enabled = true;
					gameObject.GetComponent(Player).enabled = false;
					break;
				case 1:
					break;
				case 2:
					//NOTHING HAPPENS HERE
					break;
			}
		}
	}
	*/
}
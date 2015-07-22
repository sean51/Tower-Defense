var mainOutlineSkin : GUISkin;
var towerOutlineSkin : GUISkin;
var attackOutlineSkin : GUISkin;

public var towerButtonSkins : GUISkin[] = new GUISkin[10];
public var modeButtonSkins : GUISkin[] = new GUISkin[3];

var tower1Tooltip : GUISkin;

private var towerButtons : Rect[];

private var towerTooltipRect : Rect = Rect(Screen.width*.05, Screen.height*.800, Screen.width*.075, Screen.height*.15);

private var modeButtons : Rect[];

private var buildMode : boolean = false;
private var sellMode : boolean = false;
private var attackMode : boolean = true;

function Start()
{
	towerButtons = new Rect[10];
	for(var i : int = 0; i < towerButtons.length; i++)
	{
		towerButtons[i] = Rect(Screen.width * .078 + ((i % 2) * 47), Screen.height * (.175 + (.090 * (i / 2))), Screen.width * .04, Screen.height * .07);
	}
	modeButtons = new Rect[3];
	for(var j : int = 0; j < modeButtons.length; j++)
	{
		modeButtons[j] = Rect(Screen.width * (.38 + (.1 * j)), Screen.height*.815, Screen.width*.05, Screen.height*.07);
	}
}

function OnGUI()
{
	var mousePosFromEvent : Vector2 = Event.current.mousePosition;
	if(buildMode)
	{
		GUI.skin = towerOutlineSkin;
		GUI.Box(Rect(Screen.width*.05, Screen.height*.15, Screen.width*.2*.7, Screen.height*.8*.6), "");
		for(var i : int = 0; i < towerButtons.length; i++)
		{
			GUI.skin = towerButtonSkins[i];
			if(GUI.Button(towerButtons[i], ""))
			{
				
			}
		}
		for(var towerButton : Rect in towerButtons)
		{
			if(towerButton.Contains(Event.current.mousePosition))
			{
				GUI.skin = tower1Tooltip;
	    		GUI.Box(towerTooltipRect, "tooltip");
    		}
		}
	}
	else if (sellMode)
	{
	
	}
	else if(attackMode)
	{
		GUI.skin = attackOutlineSkin;
		GUI.Box(Rect(Screen.width*.05, Screen.height*.15, Screen.width*.2*.7, Screen.height*.3), "");
		for(var k : int = 0; k < 6; k++)
		{
			GUI.skin = towerButtonSkins[k];
			if(GUI.Button(towerButtons[k], ""))
			{
				
			}
			if(towerButtons[k].Contains(Event.current.mousePosition))
			{
				GUI.skin = tower1Tooltip;
	    		GUI.Box(towerTooltipRect, "tooltip");
    		}
		}
	}
	GUI.skin = mainOutlineSkin;
	GUI.Box(Rect(Screen.width*.35, Screen.height*.8, Screen.width*.3, Screen.height*.1), "");
	for(var j : int = 0; j < 3; j++)
	{
		GUI.skin = modeButtonSkins[j];
		if(GUI.Button(modeButtons[j], ""))
		{
			buildMode = sellMode = attackMode = false;
			switch(j)
			{
				case 0:
					buildMode = true;
					break;
				case 1:
					sellMode = true;
					break;
				case 2:
					attackMode = true;
					break;
			}
		}
	}
}

function Update () 
{
	
}
//238
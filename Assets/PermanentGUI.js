#pragma strict

private var modeButtons : Rect[];
public var modeButtonSkins : GUISkin[] = new GUISkin[2];
public var mainOutlineSkin : GUISkin;

function Start () 
{
	modeButtons = new Rect[2];
	for(var j : int = 0; j < modeButtons.length; j++)
	{
		modeButtons[j] = Rect(0 + (200 * j), 0, Screen.width * .2, Screen.height * .2);
	}
}

function Update () 
{

}

function OnGUI()
{
	GUI.BeginGroup(Rect(Screen.width*.3, Screen.height*.8, Screen.width*.4, Screen.height*.2));
	GUI.skin = mainOutlineSkin;
	GUI.Box(Rect(0, 0, Screen.width*.4, Screen.height*.2), "");
	for(var j : int = 0; j < modeButtons.length; j++)
	{
		GUI.skin = modeButtonSkins[j];
		if(GUI.Button(modeButtons[j], ""))
		{
			switch(j)
			{
				case 0:
					gameObject.GetComponent(TowerManagement).enabled = false;
					gameObject.GetComponent(BuildGUI).enabled = false;
					gameObject.GetComponent(Build).cleanUp();
					gameObject.GetComponent(Build).enabled = false;
					gameObject.GetComponent(Player).enabled = true;
					break;
				case 1:
					gameObject.GetComponent(TowerManagement).enabled = true;
					gameObject.GetComponent(BuildGUI).enabled = true;
					gameObject.GetComponent(Build).enabled = false;
					gameObject.GetComponent(Player).enabled = false;
					break;
			}
		}
	}
	GUI.EndGroup();
}
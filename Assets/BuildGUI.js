public var archer : GameObject;
public var barricade : GameObject;
public var magic : GameObject;
public var cannon : GameObject;
public var teleport : GameObject;
public var laser : GameObject;
public var guard : GameObject;
public var demon : GameObject;
public var drain : GameObject;
public var repair : GameObject;

public var tower1Tooltip : GUISkin;
public var towerOutlineSkin : GUISkin;
public var attackOutlineSkin : GUISkin;
public var towerButtonSkins : GUISkin[] = new GUISkin[10];
private var towerButtons : Rect[];
private var towerTooltipRect : Rect = Rect(Screen.width*.05, Screen.height*.800, Screen.width*.075, Screen.height*.15);

function Start () 
{
	towerButtons = new Rect[10];
	for(var i : int = 0; i < towerButtons.length; i++)
	{
		towerButtons[i] = Rect(Screen.width * .078 + ((i % 2) * 47), Screen.height * (.175 + (.090 * (i / 2))), Screen.width * .04, Screen.height * .07);
	}
}

function Update () 
{

}

function OnGUI()
{
	var mousePosFromEvent : Vector2 = Event.current.mousePosition;
	GUI.skin = towerOutlineSkin;
	GUI.Box(Rect(Screen.width * .05, Screen.height * .15, Screen.width * .14, Screen.height * .48), "");
	for(var i : int = 0; i < towerButtons.length; i++)
	{
		GUI.skin = towerButtonSkins[i];
		if(GUI.Button(towerButtons[i], "" + i))
		{
			gameObject.GetComponent("Build").cleanUp();
			switch(i)
			{
				case 0:
					gameObject.GetComponent("Build").selectTower(barricade, false, "None", "Barricade");
					break;
				case 1:
					gameObject.GetComponent("Build").selectTower(archer, false, "Fire Projectile", "Archer");
					break;
				case 2:
					gameObject.GetComponent("Build").selectTower(cannon, false, "Fire Projectile", "Cannon");
					break;
				case 3:
					gameObject.GetComponent("Build").selectTower(teleport, true, "None", "Teleport");
					break;
				case 4:
					gameObject.GetComponent("Build").selectTower(guard, false, "None", "Guard");
					break;
				case 5:
					gameObject.GetComponent("Build").selectTower(drain, false, "Fire AOE", "Drain");
					break;
				case 6:
					gameObject.GetComponent("Build").selectTower(magic, false, "Fire Projectile", "Magic");
					break;
				case 7:
					gameObject.GetComponent("Build").selectTower(repair, false, "None", "Repair");
					break;
				case 8:
					gameObject.GetComponent("Build").selectTower(laser, false, "Fire Laser", "Laser");
					break;
				case 9:
					gameObject.GetComponent("Build").selectTower(demon, false, "None", "Demon");
					break;
			}
			gameObject.GetComponent("Build").enabled = true;
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
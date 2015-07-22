private var hit : RaycastHit;
private var ray;
private var showPanel : boolean = false;
private var target : GameObject;
private var text : String;
private var isNPC : boolean = false;

function Start () 
{
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
}

function Update () 
{
	if(Input.GetMouseButton(0))
	{
		if(Physics.Raycast (ray, hit))
		{
			if(hit.collider.gameObject.tag == "Tower")
			{
				isNPC = false;
				target = hit.collider.gameObject;
				text = target.GetComponent("Statistics").getStats();
				showPanel = true;
			}
			else if(hit.collider.gameObject.tag == "NPC")
			{
				isNPC = true;
				target = hit.collider.gameObject;
				text = target.GetComponent("NPC").getStats();
				showPanel = true;
			}
		}
	}
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
}
function OnGUI()
{
	if(target == null)
	{
		showPanel = false;
	}
	else if(showPanel)
	{
		GUI.BeginGroup(Rect(Screen.width * .8, Screen.height * .15, Screen.width * .14, Screen.height * .48));
		GUI.Box(Rect(0, 0, Screen.width * .14, Screen.height * .48), ""); //TEMPORARY
		if(isNPC)
		{
			GUI.Box (Rect (0, Screen.height * .05, Screen.width * .14 ,Screen.height * .43), target.GetComponent("NPC").getStats());
		}
		else
		{
			if(GUI.Button(Rect(0, 0, Screen.width * .07, Screen.height * .05), "Upgrade"))
			{
				target.GetComponent("Statistics").increaseLevel();
			}
			if(GUI.Button(Rect(Screen.width * .07, 0, Screen.width * .07, Screen.height * .05), "Sell"))
			{
				target.GetComponent("Statistics").destroyTower();
				showPanel = false;
			}
			GUI.Box (Rect (0, Screen.height * .05, Screen.width * .14 ,Screen.height * .43), target.GetComponent("Statistics").getStats());
		}
		if(GUI.Button(Rect(0, Screen.height * .43, Screen.width * .14, Screen.height * .05), "Close"))
		{
			target = null;
			showPanel = false;
		}
		GUI.EndGroup();
	}
}
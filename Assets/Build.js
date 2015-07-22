private var current : GameObject;
private var hit : RaycastHit;
private var ray;

private var currentInHandObject: GameObject;

private var rotating : boolean = false;
private var savedPosition : Vector3;

private var twoClickBuild : boolean = false;
private var secondClick : boolean = false;
private var previousTower : GameObject;

private var buildLock : boolean = true;

private var outOfBounds : boolean = false;

function Start () 
{
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
}

function Update () 
{
	if(Physics.Raycast (ray, hit))
	{
		if(outOfBounds)
		{
			outOfBounds = false;
			currentInHandObject.GetComponent.<Renderer>().enabled = true;
		}
		if(!rotating)
		{
			currentInHandObject.transform.position = hit.point;
		}
	}
	else if(!outOfBounds)
	{
		currentInHandObject.GetComponent.<Renderer>().enabled = false;
		outOfBounds = true;
	}
	if(Input.GetMouseButtonDown(0))
	{
		buildLock = false;
		savedPosition = hit.point;
	}
	else if(Input.GetMouseButtonDown(1))
	{
		changeModes();
	}
	if(Input.GetMouseButton(0))
	{	
		rotating = true;
		currentInHandObject.transform.LookAt(Vector3(hit.point.x, currentInHandObject.transform.position.y, hit.point.z));
	}
	if(Input.GetMouseButtonUp(0))
	{
		if(!buildLock)
		{
			create();
			rotating = false;
		}
		buildLock = true;
	}
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
}

function create()
{
	if(Physics.Raycast (ray, hit))
	{
		if(currentInHandObject.gameObject.GetComponent("DisplayTower").isPlaceable())
		{
			if(twoClickBuild)
			{
				if(secondClick)
				{
					if(Vector3.Distance(hit.point, previousTower.transform.position) < 10)
					{
						var placedTower01 : GameObject;
						placedTower01 = Instantiate (current, savedPosition, currentInHandObject.transform.rotation);
						Destroy(placedTower01.gameObject.GetComponent("DisplayTower"));
						for (var child : Transform in placedTower01.transform) 
						{
							if(child.name == "Range Halo")
							{
								Destroy(child.gameObject);
							}
						}
						current = currentInHandObject.GetComponent("Statistics").getOtherPart();
						Destroy(currentInHandObject);
						currentInHandObject = Instantiate (current, Vector3(0, 0, 0), current.transform.rotation);
						Destroy(currentInHandObject.gameObject.GetComponent("Collider"));
						secondClick = false;
						previousTower.GetComponent("Statistics").enabled = true;
						previousTower.GetComponent("Statistics").SendMessage("setOtherPart", placedTower01);
						previousTower.GetComponent("Collider").enabled = true;
						for (var child : Transform in currentInHandObject.transform) 
						{
							if(child.name == "Fire Projectile")
							{
								Destroy(child.gameObject);
							}
				    	}
				    	changeModes();
			    	}
				}
				else
				{
					var placedTower02 : GameObject;
					placedTower02 = Instantiate (current, savedPosition, currentInHandObject.transform.rotation);
					Destroy(placedTower02.gameObject.GetComponent("DisplayTower"));
					for (var child : Transform in placedTower02.transform) 
					{
						if(child.name == "Range Halo")
						{
							Destroy(child.gameObject);
						}
					}
					placedTower02.GetComponent("Statistics").setName(current.GetComponent("Statistics").getName());
					current = currentInHandObject.GetComponent("Statistics").getOtherPart();
					Destroy(currentInHandObject);
					currentInHandObject = Instantiate (current, Vector3(0, 0, 0), current.transform.rotation);
					Destroy(currentInHandObject.gameObject.GetComponent("Collider"));
					placedTower02.GetComponent("Statistics").SendMessage("setOtherPart", placedTower02);
					placedTower02.GetComponent("Statistics").enabled = false;
					placedTower02.GetComponent("Collider").enabled = false;
					previousTower = placedTower02;
					secondClick = true;
				}
			}
			else
			{
				var placedTower03 : GameObject;
				placedTower03 = Instantiate (current, savedPosition, currentInHandObject.transform.rotation);
				Destroy(placedTower03.gameObject.GetComponent("DisplayTower"));
				for (var child : Transform in placedTower03.transform) 
				{
					if(child.name == "Range Halo")
					{
						Destroy(child.gameObject);
					}
				}
				placedTower03.GetComponent("Statistics").setName(current.GetComponent("Statistics").getName());
				changeModes();
			}
		}
	}
}

function cleanUp()
{
	if(secondClick)
	{
		Destroy(previousTower);
		secondClick = false;
	}
	Destroy(currentInHandObject);
	ray = Camera.main.ScreenPointToRay (Input.mousePosition);
}

function changeModes()
{
	cleanUp();
	gameObject.GetComponent(TowerManagement).enabled = true;
	this.enabled = false;
}

function selectTower(tower : GameObject, clicks : boolean, fire : String, newName : String)
{
	twoClickBuild = clicks;
	current = tower;
	Destroy(currentInHandObject);
	currentInHandObject = Instantiate (tower, Vector3(0, 0, 0), tower.transform.rotation);
	Destroy(currentInHandObject.gameObject.GetComponent("Collider"));
	if(!clicks)
	{
		Destroy(currentInHandObject.gameObject.GetComponent("Statistics"));
	}
	for (var child : Transform in currentInHandObject.transform) 
	{
		if(child.name == fire)
		{
			Destroy(child.gameObject);
		}
	}
	Debug.Log(newName);
	current.GetComponent("Statistics").setName(newName);
}
public var next : GameObject;
public var enemy : GameObject;
public var coolDown : float = .01f;
private var timer : float = 0.0;
public var target : GameObject;

function Update () 
{
	timer += Time.deltaTime;
	if(timer >= coolDown)
	{
		var temp : GameObject = Instantiate (enemy, gameObject.transform.position, gameObject.transform.rotation);
		temp.GetComponent("AI").SendMessage("waypointReached", next);
		//temp.GetComponent("AIPathfindingBehavior").setTarget(target.transform);
		timer = 0.0;
	}
}
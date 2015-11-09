public var next : GameObject;
public var enemy : GameObject;
public var coolDown : float = .01f;
public var dispersion : float = 1.0f;
private var timer : float = 0.0;
public var target : GameObject;

function Update () 
{
	timer += Time.deltaTime;
	if(timer >= coolDown)
	{
		var temp : GameObject = Instantiate (enemy, gameObject.transform.position + Vector3(Random.Range(-dispersion, dispersion), .22f, Random.Range(-dispersion, dispersion)), gameObject.transform.rotation);
		temp.GetComponent("AI").SendMessage("waypointReached", next);
		//temp.GetComponent("AIPathfindingBehavior").setTarget(target.transform);
		timer = 0.0;
	}
}
public var moving : boolean = false;
public var mending : boolean = false;
private var health : int = 100;

private var searchCooldown : float = 2.0;
private var mendCooldown : float = 1.0;
private var followCooldown : float = 4.0;

private var timer : float = 0.0;
private var target : GameObject = null;
public var repairTower : GameObject = null;

private var detecting : boolean = false;

private var speed : int = 3;

function Update () 
{
	if(mending)
	{
		if(target == null)
		{
			mending = false;
		}
		else if(Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			if(timer >= mendCooldown)
			{
				timer = 0.0f;
				GetComponent.<Animation>().Stop();
				gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
				GetComponent.<Animation>().Play("BigAttack");
				mendTarget();
			}
		}
		else
		{
			mending = false;
			moving = true;
		}
	}
	else if(moving)
	{
		if(target != null)
		{
			if(Vector3.Distance(transform.position, target.transform.position) < 1)
			{
				mending = true;
				moving = false;
			}
			else
			{
				if(timer < followCooldown)
				{
					GetComponent.<Animation>().Play("Run");
					gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
					transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
				}
				else
				{
					loseTarget();
				}
			}
		
		}
		else
		{
			moving = false;
		}
	}
	else if(target == null && timer > searchCooldown)
	{
		target = repairTower.GetComponent("Statistics").findSingleTower();
		timer = 0.0f;
		if(target != null)
		{
			moving = true;
		}
	}
	timer += Time.deltaTime;
}

function mendTarget()
{
	mending = target.GetComponent("Statistics").mend(20);
}

function linkTower(myTower : GameObject)
{
	repairTower = myTower;
}

function Attack (theTarget : GameObject)
{
	target = theTarget;
	detecting =  false;
	moving = true;
	timer = 0.0f;
}

function loseTarget()
{
	moving = false;
	mending = false;
	target = null;
	timer = 0.0f;
}

function takeDamage(amount : int)
{
	health -= amount;
	if(health <= 0)
	{
		repairTower.GetComponent("Statistics").minionDied();
		Destroy(gameObject);
	}
}








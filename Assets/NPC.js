//STATES
private var moving : boolean = false;
private var attacking : boolean = false;
private var hunting: boolean = false;

//ADDITIONAL STATE
private var detecting : boolean = false;
private var targetIsNPC : boolean = false;

//STATISTICS
private var maxHealth : int = 100;
private var health : int = 100;
public var damage : int = 10;
private var speed : int = 2;

//COOLDOWN THRESHOLDS
private var searchCooldown : float = 2.0;
private var attackCooldown : float = 1.0;
private var followCooldown : float = 3.0;

//COOLDOWN TIMER
private var timer : float = 0.0;

//CURRENTLY FOCUSED GAMEOBJECT
private var target : GameObject = null;

//SPAWNING TOWER
private var homeTower : GameObject = null;

//SPECIAL UNITS
public var mender : boolean = false;

//CONVERSION
public var conversionScript : MonoScript;

function Start()
{
	if(mender)
	{
		GetComponent.<Animation>().Play("Spawn");
	}
}

function Update () 
{
	//STATE SPECIFIC BEHAVIORS
	if(attacking)
	{
		if(target == null)
		{
			attacking = false;
		}
		else if(Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			if(timer >= attackCooldown)
			{
				timer = 0.0f;
				GetComponent.<Animation>().Stop();
				gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
				GetComponent.<Animation>().Play("BigAttack");
				if(mender)
				{
					mendTarget();
				}
				else
				{
					doDamage();
				}
			}
		}
		else
		{
			attacking = false;
			moving = true;
		}
	}
	else if(moving)
	{
		if(target != null)
		{
			if(Vector3.Distance(transform.position, target.transform.position) < 1)
			{
				attacking = true;
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
	else if(hunting)
	{
		var range : float = .25;
		var foundWaypoints = new Array();
		while(target == null)
		{
			var hitColliders = Physics.OverlapSphere(gameObject.transform.position, range);
			for (var i = 0; i < hitColliders.Length; i++) 
			{
				if (hitColliders[i].gameObject.tag == "End")
				{
					foundWaypoints.push(hitColliders[i].gameObject);
				}
			}
			if(foundWaypoints.length > 0)
			{
				target = foundWaypoints.pop();
				while (foundWaypoints.length > 0)
				{
					var otherWaypoint = foundWaypoints.pop();
					if(Vector3.Distance(transform.position, otherWaypoint.transform.position) < Vector3.Distance(transform.position, target.transform.position))
					{
						target = otherWaypoint;
					}
				}
			}
			range *= 2;
		}
		if(Vector3.Distance(transform.position, target.transform.position) < 1)
		{
			target = target.GetComponent("Waypoint").getPrevious();
			if(target == null)
			{
				hunting = false;
			}
		}
		else
		{
			GetComponent.<Animation>().Play("Run");
			gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
			transform.position = Vector3.MoveTowards(transform.position, Vector3(target.transform.position.x, transform.position.y, target.transform.position.z), speed * Time.deltaTime);
		}
	}
	//START METHODS OF FINDING TARGETS
	if((target == null || hunting) && timer > searchCooldown)
	{
		var newTarget : GameObject;
		if(mender)
		{
			newTarget = homeTower.GetComponent("Statistics").findSingleTower();
		}
		else
		{
			newTarget = homeTower.GetComponent("Statistics").findSingleEnemy();
		}
		timer = 0.0f;
		if(newTarget != null)
		{
			target = newTarget;
			moving = true;
		}
		else if(!mender)
		{
			hunting = true;
		}
	}
	if(!mender && (target == null || hunting) && !detecting)
	{
		gameObject.GetComponentInChildren(DetectEnemies).SendMessage("locateEnemy");
		detecting = true;
	}
	timer += Time.deltaTime;
}

function mendTarget()
{
	if(target.gameObject.tag == "NPC")
	{
		attacking = target.GetComponent("NPC").mend(20);
	}
	else if(target.gameObject.tag == "Tower")
	{
		attacking = target.GetComponent("Statistics").mend(20);
	}
	else
	{
		Debug.Log("HERE");
		attacking = false;
		//UnityEngineInternal.APIUpdaterRuntimeServices.AddComponent(target.gameObject, "Assets/NPC.js(193,17)", "conversionScript");
	}
}

function setNPC(isNPC : boolean)
{
	targetIsNPC = isNPC;
}

function doDamage()
{
	var dmgPacket = new Array();
	dmgPacket.push(damage);
	dmgPacket.push(homeTower);
	target.GetComponent("AI").SendMessage("takeDamage", dmgPacket);
}

function linkTower(myTower : GameObject)
{
	homeTower = myTower;
	for (var child : Transform in gameObject.transform) 
	{
		if(child.name == "Flame")
		{
			child.gameObject.GetComponent("FlameAttack").linkTower(homeTower);
		}
	}
}

function Attack (theTarget : GameObject)
{
	target = theTarget;
	detecting =  false;
	hunting = false;
	moving = true;
	timer = 0.0f;
}

function loseTarget()
{
	moving = false;
	attacking = false;
	target = null;
	timer = 0.0f;
}

function takeDamage(amount : int)
{
	health -= amount;
	if(health <= 0)
	{
		homeTower.GetComponent("Statistics").minionDied();
		Destroy(gameObject);
	}
}

function setDamage(amount : int)
{
	damage = amount;
}

function getDamage() : int
{
	return damage;
}

function mend(amount : int) : boolean
{
	health += maxHealth / amount;
	if(health >= maxHealth)
	{
		health = maxHealth;
		return false;
	}
	return true;
}

function getHealth() : int
{
	return health;
}

function getMaxHealth() : int
{
	return maxHealth;
}

function getMender() : boolean
{
	return mender;
}

function getStats() : String
{
	return "MYNAME" + "\nLevel MYLEVEL: " + "\nHealth: " + health + "/" + maxHealth + "\nKills MYKILLS: " + "\nTotal Damage: MYDAMAGE" + "\n";
}

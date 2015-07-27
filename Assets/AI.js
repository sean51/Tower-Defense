public var moving : boolean = false;
public var attacking : boolean = false;

private var burning : boolean = false;
private var burnTotal : int = 0;
private var burnTower : GameObject;
private var burnTimer : float = 0.0f;
private var burnFrequencyTimer : float = 0.0f;
private var burnTime : float = 3.0f;

private var targetIsNPC : boolean = false;

public var health : int = 100;
private var coolDown : float = 1.0;
private var timer : float = 0.0;
private var target : GameObject = null;
private var waypoint : GameObject;
private var currentPoint : int = 0;

public var damageNumbers: GameObject;

private var speed : int = 5;

public var damage : int = 10;

function Start () 
{
	GetComponent.<Animation>()["run"].speed = 2;
}

function Update () 
{
	if(moving)
	{
		GetComponent.<Animation>().Play("run");
		
		transform.position = Vector3.MoveTowards(transform.position, Vector3(waypoint.transform.position.x, transform.position.y, waypoint.transform.position.z), speed * Time.deltaTime);
	}
	else if(attacking)
	{
		if(target != null)
		{
			if(Vector3.Distance(transform.position, target.transform.position) < 1)
			{
				timer += Time.deltaTime;
				if(timer >= coolDown)
				{
					GetComponent.<Animation>().Stop();
					gameObject.transform.LookAt(Vector3(target.transform.position.x, gameObject.transform.position.y, target.transform.position.z));
					GetComponent.<Animation>().Play("BigAttack");
					doDamage();
					timer = 0.0;
				}
			}
			else
			{
				loseTarget();
			}
		}
		else
		{
			loseTarget();
		}
	}
	if(burning)
	{
		burnTimer += Time.deltaTime;
		burnFrequencyTimer += Time.deltaTime;
		if(burnFrequencyTimer > .3)
		{
			burnFrequencyTimer = 0.0f;
			burnDamage();
		}
		if(burnTimer >= burnTime)
		{
			burning = false;
			if(burnTower != null)
			{
				burnTower.GetComponent(Tower).increaseDamageDealt(burnTotal);
			}
			burnTotal = 0;
		}
	}
}

function loseTarget()
{
	moving = true;
	attacking = false;
	gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
	gameObject.transform.LookAt(waypoint.transform);
}

function Attack (theTarget : GameObject)
{
	target = theTarget;
	attacking = true;
	moving = false;
	targetIsNPC = false;
}

function attackNPC(theTarget : GameObject)
{
	target = theTarget;
	attacking = true;
	moving = false;
	targetIsNPC = true;
}

function doDamage()
{
	var dmg_packet : List.<Object> = new List.<Object>();
	dmg_packet.Add(damage);
	dmg_packet.Add(gameObject);
	if(targetIsNPC)
	{
		target.GetComponent(NPC).SendMessage("takeDamage", dmg_packet);
	}
	else
	{
		target.GetComponent(Tower).SendMessage("takeDamage", dmg_packet);
	}
}

function takeDamage(dmg_packet : List.<Object>)
{
	var attacker : GameObject = dmg_packet[1];
	var damage : int = dmg_packet[0];
	displayDamage(damage);
	if(attacker != null)
	{
		attacker.GetComponent(Tower).increaseDamageDealt(Mathf.Min(damage, health));
	}
	health -= damage;
	if(health <= 0)
	{
		Level.KILLED++;
		if(attacker != null)
		{
			attacker.GetComponent(Tower).increaseKills();
		}
		Destroy(gameObject);
	}
}

function drainDamage(percent : float, attacker : GameObject)
{
	var damage : int = health * percent;
	attacker.GetComponent("Statistics").increaseDamageDealt(damage);
	health -= damage;
	displayDamage(damage);
}

function setBurn(attacker : GameObject)
{
	burnTower = attacker;
	burning = true;
}

function burnDamage()
{
	burnTotal += 1;
	displayDamage(1);
	health -= 1;
	if(health <= 0)
	{
		Level.KILLED++;
		if(burnTower != null)
		{
			burnTower.GetComponent(Tower).increaseKills();
			burnTower.GetComponent(Tower).increaseDamageDealt(burnTotal);
		}
		Destroy(gameObject);
	}
}

function waypointReached(nextWaypoint : GameObject)
{
	waypoint = nextWaypoint;
	gameObject.transform.LookAt(waypoint.transform);
	moving = true;
	gameObject.GetComponentInChildren(DetectTowers).SendMessage("ObjectDead");
}

function displayDamage(amount : int)
{
	var damageNumber : GameObject = Instantiate(damageNumbers,gameObject.transform.position,Quaternion.identity);
	damageNumber.GetComponent.<GUIText>().text = amount.ToString();
	damageNumber.GetComponent("DamageNumber").linkObject(transform.position);
}
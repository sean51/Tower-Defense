 #pragma strict

private var coolDown : float = 3.0;
private var timer : float = 0.0;
private var shootingTower : GameObject;
private var damage : int;
private var target : GameObject;

private var burning : boolean = false;
public var destructible : boolean;

function Update () 
{
	timer += Time.deltaTime;
	if(timer >= coolDown)
	{
		Destroy(gameObject);
	}
	if(target != null)
	{
		transform.position = Vector3.MoveTowards(transform.position, target.transform.position, Time.deltaTime * 5);
	}
}

function OnTriggerEnter(col : Collider)
{
	if(col.gameObject.tag == "Enemy")
	{
		doDamage(col.gameObject);
		if(destructible)
		{
			Destroy(gameObject);
		}
	}
}

function doDamage(target : GameObject)
{
	var dmgPacket : List.<Object> = new List.<Object>();
	dmgPacket.Add(damage);
	dmgPacket.Add(shootingTower);
	target.GetComponent("AI").SendMessage("takeDamage", dmgPacket);
	if(burning && target != null)
	{
		target.GetComponent("AI").SendMessage("setBurn", shootingTower);
	}
}

function setTower(shooter : GameObject)
{
	shootingTower = shooter;
}

function setDamage(amount : int)
{
	damage = amount;
}

function setTarget(newTarget : GameObject)
{
	target = newTarget;
}

function setBurn()
{
	burning = true;
}
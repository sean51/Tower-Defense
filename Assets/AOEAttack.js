public var range : int = 2;

private var onCooldown : boolean = true;
private var cooldownTimer : float = 0.0;
private var attackCooldown :  float = 3.0f;
private var targetList : Array;

public var damage : float = .2;

function Update () 
{
	if(onCooldown)
	{
		cooldownTimer += Time.deltaTime;
		if(cooldownTimer >= attackCooldown)
		{
			onCooldown = false;
			cooldownTimer = 0.0f;
		}
	}
}

function OnTriggerStay(col : Collider)
{
	if(!onCooldown)
	{
		if(col.gameObject.tag == "Enemy")
		{
			fire();
			onCooldown = true;
		}
	}
}

function fire()
{
	var hitColliders = Physics.OverlapSphere(gameObject.transform.position, range);
	for (var i = 0; i < hitColliders.Length; i++) 
	{
		if(hitColliders[i].gameObject.tag == "Enemy")
		{
			hitColliders[i].gameObject.GetComponent("AI").drainDamage(damage, gameObject.transform.parent.gameObject);
		}
	}
}

function setDamage(amount : float)
{
	damage = amount;
}

function getDamage() : float
{
	return damage;
}
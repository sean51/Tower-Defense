public var onCooldown : boolean = true;
private var cooldownTimer : float = 0.0;
public var attackCooldown :  float = 3.0f;

public var damage : int = 50;

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
			fire1(col.gameObject);
		}
	}
}

function fire1(target : GameObject)
{
	onCooldown = true;
	gameObject.GetComponent.<Renderer>().SetPosition(0, transform.position);
	gameObject.GetComponent.<Renderer>().SetPosition(1, target.transform.position);
   	gameObject.GetComponent.<Renderer>().enabled = true;
   	transform.LookAt(target.transform.position);
	var hits : RaycastHit[] = Physics.RaycastAll(transform.position, transform.forward, 100);
	for (var i = 0;i < hits.Length; i++) 
	{
		if(hits[i].collider.gameObject.tag == "Enemy")
		{
			var dmgPacket = new Array();
			dmgPacket.push(damage);
			dmgPacket.push(gameObject.transform.parent.gameObject);
			hits[i].collider.gameObject.GetComponent("AI").SendMessage("takeDamage", dmgPacket);
		}
	}
   	yield WaitForSeconds (.5);
   	gameObject.GetComponent.<Renderer>().enabled = false;
}

function setDamage(amount : int)
{
	damage = amount;
}

function getDamage() : int
{
	return damage;
}
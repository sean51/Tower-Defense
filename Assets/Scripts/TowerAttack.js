public var fireItem : GameObject;

private var onCooldown : boolean;
private var cooldownTimer : double;
public var attackCooldown :  double;
public var projectileSpeed :  int = 10;

public var damage : int = 10;
public var pivotable : boolean = false;
private var homing : boolean = false;
private var rapid : boolean = false;
private var burning : boolean = false;
private var multiShot : boolean = false;

function Start () 
{
	onCooldown = false;
}

function Update () 
{
	if(onCooldown)
	{
		cooldownTimer += Time.deltaTime;
		if(cooldownTimer >= attackCooldown)
		{
			onCooldown = false;
		}
	}
}

function OnTriggerStay(col : Collider)
{
	if(col.gameObject.tag == "Enemy")
	{
		if(pivotable)
		{
			gameObject.transform.parent.gameObject.transform.LookAt(Vector3(col.gameObject.transform.position.x, gameObject.transform.parent.gameObject.transform.position.y, col.gameObject.transform.position.z));
		}
		if(!onCooldown)
		{
			fire(col.gameObject);
		}
	}
}

function fire(target : GameObject)
{
	transform.LookAt(target.gameObject.transform);
	var clone : GameObject = Instantiate(fireItem, Vector3(transform.position.x, transform.position.y, transform.position.z-.3), Quaternion.identity);
	clone.GetComponent("Projectile").setTower(gameObject.transform.parent.gameObject);
	clone.GetComponent("Projectile").setDamage(damage);
	if(burning)
	{
		clone.GetComponent("Projectile").setBurn();
	}
	clone.gameObject.transform.LookAt(target.gameObject.transform);
	//clone.transform.Rotate(90, 0, 0);
	if(homing)
	{
		clone.GetComponent("Projectile").setTarget(target);
	}
	clone.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3.forward * projectileSpeed);
	onCooldown = true;
	cooldownTimer = 0.0;
	if(multiShot)
	{
		var clone4 : GameObject = Instantiate(fireItem, Vector3(transform.position.x + .2, transform.position.y, transform.position.z-.3), Quaternion.identity);
		clone4.GetComponent("Projectile").setTower(gameObject.transform.parent.gameObject);
		clone4.GetComponent("Projectile").setDamage(damage);
		clone4.gameObject.transform.LookAt(target.gameObject.transform);
		clone4.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3(-.2, 0, .7) * projectileSpeed);
		var clone5 : GameObject = Instantiate(fireItem, Vector3(transform.position.x - .2, transform.position.y, transform.position.z-.3), Quaternion.identity);
		clone5.GetComponent("Projectile").setTower(gameObject.transform.parent.gameObject);
		clone5.GetComponent("Projectile").setDamage(damage);
		clone5.gameObject.transform.LookAt(target.gameObject.transform);
		clone5.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3(.2, 0, .7) * projectileSpeed);
	}
	else if(rapid)
	{
		yield WaitForSeconds (.1);
		if(target != null)
		{
			transform.LookAt(target.gameObject.transform);
			var clone2 : GameObject = Instantiate(fireItem, Vector3(transform.position.x, transform.position.y, transform.position.z-.3), Quaternion.identity);
			clone2.GetComponent("Projectile").setTower(gameObject.transform.parent.gameObject);
			clone2.GetComponent("Projectile").setDamage(damage);
			clone2.gameObject.transform.LookAt(target.gameObject.transform);
			clone2.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3.forward * projectileSpeed);
		}
		yield WaitForSeconds (.1);
		if(target != null)
		{
			transform.LookAt(target.gameObject.transform);
			var clone3 : GameObject = Instantiate(fireItem, Vector3(transform.position.x, transform.position.y, transform.position.z-.3), Quaternion.identity);
			clone3.GetComponent("Projectile").setTower(gameObject.transform.parent.gameObject);
			clone3.GetComponent("Projectile").setDamage(damage);
			clone3.gameObject.transform.LookAt(target.gameObject.transform);
			clone3.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3.forward * projectileSpeed);
		}
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

function setHoming()
{
	homing = true;
}

function setRapid()
{
	rapid = true;
}

function setBurn()
{
	burning = true;
}

function setMulti()
{
	multiShot = true;
}
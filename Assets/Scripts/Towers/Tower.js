//#pragma strict

public class Tower extends Destructable
{
	protected var timer : float = 0.0f;
	protected var cooldown : float = 3.0f;

	public var teleport : boolean = false;

	public var guardPrefab : GameObject;
	public var linkedTower : GameObject;
	public var demonPrefab : GameObject;
	public var menderPrefab : GameObject;

	protected var spawns : Vector3[];

	private var kills : int = 0;
	protected var level : int = 1;
	private var damageDealt : int = 0;

	public var damage : int = 10;
	private var towerName : String = "None";

	public var demonLanding : GameObject;

	function Update () 
	{
		if(timer < cooldown)
		{
			timer += Time.deltaTime;
		}
	}

	function takeDamage(dmg_packet : List.<Object>)
	{
		var damage : int = dmg_packet[0];
		var attacker : GameObject = dmg_packet[1] as GameObject;
		health -= damage;
		if(health <= 0)
		{
			destroyTower();
		}
		else if(teleport && timer >= cooldown)
		{
			sendTarget(attacker);
			timer = 0.0f;
		}
	}

	function sendTarget(singleTarget : GameObject)
	{
		singleTarget.GetComponent("AI").loseTarget();
		singleTarget.transform.position = linkedTower.transform.position;
	}

	function setOtherPart(otherPart : GameObject)
	{
		linkedTower = otherPart;
	}

	function getOtherPart() : GameObject
	{
		return linkedTower;
	}

	function findSingleEnemy() : GameObject
	{
		var hitColliders = Physics.OverlapSphere(gameObject.transform.position, 3);
		for (var i = 0; i < hitColliders.Length; i++) 
		{
			if(hitColliders[i].gameObject.tag == "Enemy")
			{
				return hitColliders[i].gameObject;
			}
		}
		return null;
	}

	function destroyTower()
	{
		if(linkedTower != null)
		{
			Destroy(linkedTower);
		}
		Destroy(gameObject);
	}

	function mend(amount : int) : boolean
	{
		health += max_health / amount;
		if(health >= max_health)
		{
			health = max_health;
			return false;
		}
		return true;
	}

	function getStats() : String
	{
		return "" + towerName + "\nLevel: " + level + "\nHealth: " + health + "/" + max_health + "\nKills: " + kills + "\nTotal Damage: " + damageDealt + "\n";
	}

	function increaseKills()
	{
		kills++;
	}

	function increaseDamageDealt(dealt : int)
	{
		damageDealt += dealt;
	}

	function increaseLevel()
	{
		for (var child : Transform in gameObject.transform) 
		{
			if(child.name == "Fire Projectile")
			{
				child.GetComponent("TowerAttack").setDamage(child.GetComponent("TowerAttack").getDamage() * 2);
			}
			else if(child.name == "Fire AOE") 
			{
				child.GetComponent("AOEAttack").setDamage(child.GetComponent("AOEAttack").getDamage() * 2);
			}
			else if(child.name == "Fire Laser") 
			{
				child.GetComponent("LaserAttack").setDamage(child.GetComponent("LaserAttack").getDamage() * 2);
			}
		}
		mend(1);
		level++;
	}

	function setName(newName : String)
	{
		towerName = newName;
	}

	function getName() : String
	{
		return towerName;
	}
}
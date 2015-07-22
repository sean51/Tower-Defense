private var maxHealth : int = 100;
private var health : int = 100;
private var timer : float = 0.0f;
private var cooldown : float = 3.0f;

public var teleport : boolean = false;
public var guard : boolean = false;
public var demon : boolean = false;
public var repair : boolean = false;
public var barricade : boolean = false;
public var archer : boolean = false;
public var cannon : boolean = false;

public var guardPrefab : GameObject;
public var linkedTower : GameObject;
public var demonPrefab : GameObject;
public var menderPrefab : GameObject;

private var maxSoldiers : int = 5;
private var currentSoldiers : int = 0;
private var soldierList : Array = new Array();
private var spawnPosition : int = 0;

private var spawns : Vector3[];

private var demonRespawn : boolean = false;
private var currentDemon : GameObject;

private var repairRespawn : boolean = false;
private var currentMender : GameObject;

private var kills : int = 0;
private var level : int = 1;
private var damageDealt : int = 0;

public var damage : int = 10;
private var towerName : String = "None";

public var demonLanding : GameObject;

function Start()
{
	if(demon)
	{
		demonRespawn = true;
		spawns = new Vector3[1];
		spawns[0] = transform.position + transform.forward * 1.0;
		var hit : RaycastHit;
		if(Physics.Raycast(spawns[0], Vector3.up, hit))
		{
			if(hit.collider.gameObject.tag == "Terrain")
			{
				spawns[0] = hit.point;
			}
		}
		else if(Physics.Raycast(spawns[0], Vector3.down, hit))
		{
			if(hit.collider.gameObject.tag == "Terrain")
			{
				spawns[0] = hit.point;
			}
		}
	}
	else if(guard)
	{
		spawns = new Vector3[5];
		spawns[0] = Vector3(transform.position.x + 1, transform.position.y, transform.position.z);
		spawns[1] = Vector3(transform.position.x, transform.position.y, transform.position.z + 1.5);
		spawns[2] = Vector3(transform.position.x - 1.5, transform.position.y, transform.position.z);
		spawns[3] = Vector3(transform.position.x, transform.position.y, transform.position.z - 1.5);
		spawns[4] = Vector3(transform.position.x + 1.5, transform.position.y, transform.position.z);
		
		var hit02 : RaycastHit;
		for(var spawnLocation : Vector3 in spawns)
		{
			if(Physics.Raycast(spawnLocation, Vector3.up, hit02))
			{
				if(hit02.collider.gameObject.tag == "Terrain")
				{
					spawnLocation = hit02.point;
				}
			}
			else if(Physics.Raycast(spawnLocation, Vector3.down, hit02))
			{
				if(hit02.collider.gameObject.tag == "Terrain")
				{
					spawnLocation = hit02.point;
				}
			}
		}
	}
	else if(repair)
	{
		repairRespawn = true;
		spawns = new Vector3[1];
		Debug.Log(Vector3.forward);
		spawns[0] = transform.position + transform.forward * 1.0;
		var hit03 : RaycastHit;
		if(Physics.Raycast(spawns[0], Vector3.up, hit03))
		{
			if(hit03.collider.gameObject.tag == "Terrain")
			{
				spawns[0] = hit03.point;
			}
		}
		else if(Physics.Raycast(spawns[0], Vector3.down, hit03))
		{
			if(hit03.collider.gameObject.tag == "Terrain")
			{
				spawns[0] = hit03.point;
			}
		}
	}
}

function Update () 
{
	if(timer < cooldown)
	{
		timer += Time.deltaTime;
	}
	if(guard && timer >= cooldown && currentSoldiers < maxSoldiers)
	{
		summonGuard();
		timer = 0.0f;
	}
	if(demon && demonRespawn && timer >= cooldown)
	{
		summonDemon();
		timer = 0.0f;
	}
	if(repair && repairRespawn && timer >= cooldown)
	{
		summonMender();
		timer = 0.0f;
	}
}

function takeDamage(dmgPacket : Array)
{
	var attacker : GameObject = dmgPacket.pop();
	var damage : int = dmgPacket.pop();
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
	else if(barricade && level > 1)
	{
		var returnPacket = new Array();
		returnPacket.push(damage);
		returnPacket.push(gameObject);
		attacker.GetComponent("AI").SendMessage("takeDamage", returnPacket);
		if(level > 2)
		{
			attacker.GetComponent.<Rigidbody>().velocity = transform.TransformDirection(Vector3.forward * 5);
		}
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

function summonGuard()
{
	var newRecruit : GameObject = Instantiate (guardPrefab, spawns[spawnPosition++ % maxSoldiers], guardPrefab.transform.rotation);
	newRecruit.GetComponent("NPC").linkTower(gameObject);
	newRecruit.GetComponent("NPC").setDamage(damage);
	currentSoldiers++;
	soldierList.push(newRecruit);
}

function findSingleEnemy() : GameObject
{
	var hitColliders = Physics.OverlapSphere(gameObject.transform.position, 2);
	for (var i = 0; i < hitColliders.Length; i++) 
	{
		if(hitColliders[i].gameObject.tag == "Enemy")
		{
			return hitColliders[i].gameObject;
		}
	}
		return null;
}

function summonDemon()
{
	if(level > 2)
	{
		var dropLocation : Vector3 = spawns[0];
		//var lockedEnemy : GameObject = null;
		var hitColliders = Physics.OverlapSphere(gameObject.transform.position, 8);
		for (var i = 0; i < hitColliders.Length; i++) 
		{
			if(hitColliders[i].gameObject.tag == "Enemy")
			{
				dropLocation = hitColliders[i].gameObject.transform.position;
				//lockedEnemy = hitColliders[i].gameObject;
				var areaSearch = Physics.OverlapSphere(gameObject.transform.position, 4);
				var count : int = 0;
				for (var j = 0; j < areaSearch.Length; j++) 
				{
					if(areaSearch[j].gameObject.tag == "Enemy")
					{
						count++;
					}
				}
				if(count > 5)
				{
					break;
				}
			}
		}
		var deathToAll = Physics.OverlapSphere(dropLocation, 2);
		for (var k = 0; k < deathToAll.Length; k++) 
		{
			if(deathToAll[k].gameObject.tag == "Enemy")
			{
				var instantDeath = new Array();
				instantDeath.push(99);
				instantDeath.push(gameObject);
				deathToAll[k].gameObject.GetComponent("AI").SendMessage("takeDamage", instantDeath);
			}
		}
		var fireVictims = Physics.OverlapSphere(dropLocation, 4);
		for (var l = 0; l < fireVictims.Length; l++) 
		{
			if(fireVictims[l].gameObject.tag == "Enemy")
			{
				fireVictims[l].gameObject.GetComponent("AI").SendMessage("setBurn", gameObject);
			}
		}
		var newUpgradeDemon : GameObject = Instantiate (demonPrefab, dropLocation, demonPrefab.transform.rotation);
		var particleEffect : GameObject = Instantiate (demonLanding, Vector3(dropLocation.x, 1, dropLocation.z), demonLanding.transform.rotation);
		newUpgradeDemon.GetComponent("NPC").linkTower(gameObject);
		for (var child : Transform in newUpgradeDemon.transform) 
		{
			if(child.name == "Flame")
			{
				child.gameObject.SetActive(true);
			}
		}
	}
	else if(level > 1)
	{
		var newDemon : GameObject = Instantiate (demonPrefab, spawns[0], demonPrefab.transform.rotation);
		newDemon.GetComponent("NPC").linkTower(gameObject);
		for (var child : Transform in newDemon.transform) 
		{
			if(child.name == "Flame")
			{
				child.gameObject.SetActive(true);
			}
		}
		currentDemon = newDemon;
	}
	else
	{
		var newDemon2 : GameObject = Instantiate (demonPrefab, spawns[0], demonPrefab.transform.rotation);
		newDemon2.GetComponent("NPC").linkTower(gameObject);
		currentDemon = newDemon2;
	}
	demonRespawn = false;
}

function destroyTower()
{
	if(linkedTower != null)
	{
		Destroy(linkedTower);
	}
	if(guard)
	{
		for(var soldier : GameObject in soldierList)
		{
			Destroy(soldier);
		}
	}
	else if(demon)
	{
		Destroy(currentDemon);
	}
	else if(repair)
	{
		Destroy(currentMender);
	}
	Destroy(gameObject);
}

function minionDied()
{
	if(demon)
	{
		timer = 0.0f;
		demonRespawn = true;
	}
	else if(guard)
	{
		if(currentSoldiers == maxSoldiers)
		{
			timer = 0.0f;
		}
		currentSoldiers--;
	}
	else if(repair)
	{
		timer = 0.0f;
		repairRespawn = true;
	}
}

function summonMender()
{
	var newMender : GameObject = Instantiate (menderPrefab, spawns[0], menderPrefab.transform.rotation);
	newMender.GetComponent("NPC").linkTower(gameObject);
	currentMender = newMender;
	repairRespawn = false;
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

function findSingleTower() : GameObject
{
	var chosenTower : GameObject = null;
	var hitColliders = Physics.OverlapSphere(gameObject.transform.position, 3);
	var isNPC : boolean = false;
	for (var i = 0; i < hitColliders.Length; i++) 
	{
		if(hitColliders[i].gameObject.tag == "Tower")
		{
			if(isNPC && hitColliders[i].gameObject.GetComponent("Statistics").getHealth() < chosenTower.gameObject.GetComponent("NPC").getHealth())
			{
				chosenTower = hitColliders[i].gameObject;
				isNPC = false;
			}
			else if(chosenTower == null || hitColliders[i].gameObject.GetComponent("Statistics").getHealth() < chosenTower.gameObject.GetComponent("Statistics").getHealth())
			{
				chosenTower = hitColliders[i].gameObject;
				isNPC = false;
			}
		}
		else if(level > 1 && hitColliders[i].gameObject.tag == "NPC")
		{
			if(isNPC)
			{
				if(!hitColliders[i].gameObject.GetComponent("NPC").isMender() && hitColliders[i].gameObject.GetComponent("NPC").getHealth() < chosenTower.gameObject.GetComponent("NPC").getHealth())
				{
					chosenTower = hitColliders[i].gameObject;
					isNPC = true;
				}
			}
			else if(chosenTower == null || hitColliders[i].gameObject.GetComponent("NPC").getHealth() < chosenTower.gameObject.GetComponent("Statistics").getHealth())
			{
				chosenTower = hitColliders[i].gameObject;
				isNPC = true;
			}
		}
		else if(level > 3 && hitColliders[i].gameObject.tag == "Enemy")
		{
			if(chosenTower == null)
			{
				chosenTower = hitColliders[i].gameObject;
				isNPC = true;
			}
		}
	}
	if(isNPC)
	{
		if(chosenTower.gameObject.tag == "Enemy")
		{
			return chosenTower;
		}
		else if(chosenTower.GetComponent("NPC").getHealth() < chosenTower.GetComponent("NPC").getMaxHealth())
		{
			return chosenTower;
		}
	}
	else if(chosenTower != null && chosenTower.GetComponent("Statistics").getHealth() < chosenTower.GetComponent("Statistics").getMaxHealth())
	{
		return chosenTower;
	}
	return null;
}

function getHealth() : int
{
	return health;
}

function getMaxHealth() : int
{
	return maxHealth;
}

function getStats() : String
{
	return "" + towerName + "\nLevel: " + level + "\nHealth: " + health + "/" + maxHealth + "\nKills: " + kills + "\nTotal Damage: " + damageDealt + "\n";
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
	if(guard)
	{
		damage *= 2;
	}
	else if(demon)
	{
		demonPrefab.GetComponent("NPC").setDamage(demonPrefab.GetComponent("NPC").getDamage() * 2);
	}
	else if(barricade)
	{
		maxHealth += 100;
	}
	for (var child : Transform in gameObject.transform) 
	{
		if(child.name == "Fire Projectile")
		{
			child.GetComponent("TowerAttack").setDamage(child.GetComponent("TowerAttack").getDamage() * 2);
			if(archer)
			{
				if(level < 2)
				{
					child.GetComponent("TowerAttack").setHoming();
				}
				else
				{
					child.GetComponent("TowerAttack").setRapid();
				}
			}
			else if(cannon)
			{
				if(level < 2)
				{
					child.GetComponent("TowerAttack").setBurn();
				}
				else
				{
					child.GetComponent("TowerAttack").setMulti();
				}
			}
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

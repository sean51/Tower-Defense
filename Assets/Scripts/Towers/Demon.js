#pragma strict

public class  Demon extends Tower
{
	private var demonRespawn : boolean = false;
	private var currentDemon : GameObject;
	
	//Overwritten from Tower
	function Start () 
	{
		health = 100;
		max_health = 100;
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

	//Overwritten from Tower
	function Update () 
	{
		super.Update();
		if(demonRespawn && timer >= cooldown)
		{
			summonDemon();
			timer = 0.0f;
		}
	}
	
	//Overwritten from Tower
	function destroyTower()
	{
		//Overwritten from Tower
		super.destroyTower();
	}
	
	//Overwritten from Tower
	function minionDied()
	{
		timer = 0.0f;
		demonRespawn = true;
	}
	
	//Overwritten from Tower
	function increaseLevel()
	{
		demonPrefab.GetComponent(NPC).setDamage(demonPrefab.GetComponent(NPC).getDamage() * 2);
		mend(1);
		level++;
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
					var instantDeath : List.<Object> = new List.<Object>();
					instantDeath.Add(99);
					instantDeath.Add(gameObject);
					deathToAll[k].gameObject.GetComponent("AI").SendMessage("takeDamage", instantDeath);
				}
			}
			var fireVictims = Physics.OverlapSphere(dropLocation, 4);
			for (var l = 0; l < fireVictims.Length; l++) 
			{
				if(fireVictims[l].gameObject.tag == "Enemy")
				{
					fireVictims[l].gameObject.GetComponent(AI).SendMessage("setBurn", gameObject);
				}
			}
			var newUpgradeDemon : GameObject = Instantiate (demonPrefab, dropLocation, demonPrefab.transform.rotation);
			var particleEffect : GameObject = Instantiate (demonLanding, Vector3(dropLocation.x, 1, dropLocation.z), demonLanding.transform.rotation);
			newUpgradeDemon.GetComponent(NPC).linkTower(gameObject);
			
			var child : Transform = newUpgradeDemon.transform.Find("Flame");
			child.gameObject.SetActive(true);
		}
		else if(level > 1)
		{
			var newDemon : GameObject = Instantiate (demonPrefab, spawns[0], demonPrefab.transform.rotation);
			newDemon.GetComponent(NPC).linkTower(gameObject);
			
			var child2 : Transform = newDemon.transform.Find("Flame");
			child2.gameObject.SetActive(true);
			currentDemon = newDemon;
		}
		else
		{
			var newDemon2 : GameObject = Instantiate (demonPrefab, spawns[0], demonPrefab.transform.rotation);
			newDemon2.GetComponent(NPC).linkTower(gameObject);
			currentDemon = newDemon2;
		}
		demonRespawn = false;
	}
}